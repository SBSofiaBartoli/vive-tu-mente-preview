import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UploadFileResponseDto } from './dto/upload-file-response.dto';
import { StorageService } from './storage.service';
import type { UploadFile } from './storage.types';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @ApiOperation({
    summary: 'Subir archivo a Supabase Storage',
    description:
      'Recibe un archivo, valida tipo y tamaño, lo sube a Supabase Storage y devuelve la metadata necesaria para registrarlo.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({
    name: 'section',
    required: false,
    example: 'blog',
    description: 'Sección usada para organizar el archivo dentro del bucket.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description:
            'Archivo a subir. Se aceptan JPG, PNG, WebP, PDF, DOC y DOCX.',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Archivo subido correctamente.',
    type: UploadFileResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Archivo ausente, demasiado grande o con tipo no permitido.',
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  uploadFile(
    @UploadedFile() file: UploadFile | undefined,
    @Query('section') section?: string,
  ) {
    return this.storageService.uploadFile(file, section);
  }
}
