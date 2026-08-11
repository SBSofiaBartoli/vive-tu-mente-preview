import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import type { ArticleStatus } from '../article.types';

const articleStatuses: ArticleStatus[] = [
  'draft',
  'pending_review',
  'changes_requested',
  'published',
  'rejected',
  'archived',
];

export class ListArticlesAdminQueryDto {
  @ApiPropertyOptional({
    example: 'pending_review',
    enum: articleStatuses,
    description: 'Estado opcional para filtrar artículos.',
  })
  @IsOptional()
  @IsIn(articleStatuses)
  status?: ArticleStatus;

  @ApiPropertyOptional({
    example: 'bienestar',
    description: 'Categoría opcional para filtrar artículos.',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: 'ansiedad',
    description: 'Texto para buscar por título, bajada o contenido.',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
