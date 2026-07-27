import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import type { CreateMediaFileDto } from './dto/create-media-file.dto';
import type { UpdateMediaFileStatusDto } from './dto/update-media-file-status.dto';
import type { MediaFile } from './media-file.types';
import type { PaginatedResponse } from '../common/types/paginated-response.type';
import type { ListMediaFilesAdminQueryDto } from './dto/list-media-files-admin-query.dto';

const ensureData = <T>(data: unknown): T => {
  if (!data) {
    throw new NotFoundException('No se encontró el archivo indicado.');
  }

  return data as T;
};

const contextualSections = ['donations', 'article-proposals'];

@Injectable()
export class MediaFilesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findApproved(section?: string): Promise<MediaFile[]> {
    let query = this.supabaseService
      .getAdminClient()
      .from('media_files')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (section) {
      query = query.eq('section', section);
    }

    const response = await query;

    if (response.error) {
      throw new BadRequestException(response.error.message);
    }

    return ensureData<MediaFile[]>(response.data);
  }

  async findAllAdmin(
    filters: ListMediaFilesAdminQueryDto,
  ): Promise<PaginatedResponse<MediaFile>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabaseService
      .getAdminClient()
      .from('media_files')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.section) {
      query = query.eq('section', filters.section);
    }

    if (filters.scope === 'library' && !filters.section) {
      query = query.not(
        'section',
        'in',
        `(${contextualSections.map((section) => `"${section}"`).join(',')})`,
      );
    }

    if (filters.search) {
      query = query.or(
        `original_name.ilike.%${filters.search}%,uploaded_by_name.ilike.%${filters.search}%`,
      );
    }

    const response = await query;

    if (response.error) {
      throw new BadRequestException(response.error.message);
    }

    const total = response.count ?? 0;

    return {
      items: ensureData<MediaFile[]>(response.data),
      meta: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async create(createMediaFileDto: CreateMediaFileDto): Promise<MediaFile> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('media_files')
      .insert({
        ...createMediaFileDto,
        section: createMediaFileDto.section ?? 'general',
        status: 'pending',
      })
      .select()
      .single();

    if (response.error) {
      throw new BadRequestException(response.error.message);
    }

    return ensureData<MediaFile>(response.data);
  }

  async updateStatus(
    id: string,
    updateMediaFileStatusDto: UpdateMediaFileStatusDto,
  ): Promise<MediaFile> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('media_files')
      .update({
        status: updateMediaFileStatusDto.status,
        review_notes: updateMediaFileStatusDto.review_notes ?? null,
        rejection_reason: updateMediaFileStatusDto.rejection_reason ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (response.error) {
      throw new NotFoundException('No se encontró el archivo indicado.');
    }

    return ensureData<MediaFile>(response.data);
  }

  async remove(id: string): Promise<{ id: string }> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('media_files')
      .delete()
      .eq('id', id);

    if (response.error) {
      throw new NotFoundException('No se encontró el archivo indicado.');
    }

    return { id };
  }
}
