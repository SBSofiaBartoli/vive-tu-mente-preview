import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
import type { UploadedStorageFile, UploadFile } from './storage.types';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const sanitizeFileName = (fileName: string): string =>
  fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.\-_]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();

@Injectable()
export class StorageService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(
    file: UploadFile | undefined,
    section = 'general',
  ): Promise<UploadedStorageFile> {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo.');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Tipo de archivo no permitido. Se aceptan JPG, PNG, WebP, PDF, DOC y DOCX.',
      );
    }

    const maxUploadSizeMb =
      this.configService.get<number>('MAX_UPLOAD_SIZE_MB') ?? 5;
    const maxUploadSizeBytes = maxUploadSizeMb * 1024 * 1024;

    if (file.size > maxUploadSizeBytes) {
      throw new BadRequestException(
        `El archivo supera el tamaño máximo permitido de ${maxUploadSizeMb}MB.`,
      );
    }

    const bucket =
      this.configService.get<string>('SUPABASE_STORAGE_BUCKET') ?? 'media';

    const currentYear = new Date().getFullYear();
    const safeSection = sanitizeFileName(section || 'general');
    const safeFileName = sanitizeFileName(file.originalname);
    const storagePath = `${safeSection}/${currentYear}/${Date.now()}-${safeFileName}`;

    const uploadResponse = await this.supabaseService
      .getAdminClient()
      .storage.from(bucket)
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadResponse.error) {
      throw new InternalServerErrorException(uploadResponse.error.message);
    }

    const publicUrlResponse = this.supabaseService
      .getAdminClient()
      .storage.from(bucket)
      .getPublicUrl(storagePath);

    return {
      original_name: file.originalname,
      storage_path: storagePath,
      public_url: publicUrlResponse.data.publicUrl,
      mime_type: file.mimetype,
      file_size: file.size,
    };
  }
}
