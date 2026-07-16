import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import type { MediaFileStatus } from '../media-file.types';

const mediaFileStatuses: MediaFileStatus[] = [
  'pending',
  'changes_requested',
  'approved',
  'rejected',
  'archived',
];

export class ListMediaFilesAdminQueryDto {
  @ApiPropertyOptional({
    example: 'pending',
    enum: mediaFileStatuses,
    description: 'Estado opcional para filtrar archivos.',
  })
  @IsOptional()
  @IsIn(mediaFileStatuses)
  status?: MediaFileStatus;

  @ApiPropertyOptional({
    example: 'donation',
    description: 'Sección opcional para filtrar archivos.',
  })
  @IsOptional()
  @IsString()
  section?: string;

  @ApiPropertyOptional({
    example: 'informe',
    description: 'Texto para buscar por nombre de archivo o persona que subió.',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Página de resultados.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: 'Cantidad de resultados por página.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
