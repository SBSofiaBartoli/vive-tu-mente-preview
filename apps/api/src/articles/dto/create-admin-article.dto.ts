import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';
import type { ArticleStatus } from '../article.types';

const trimString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

const nullableTrimString = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmedValue = value.trim();

  return trimmedValue === '' ? null : trimmedValue;
};

export class CreateAdminArticleDto {
  @ApiProperty({
    example: 'Herramientas para manejar la ansiedad académica',
    description: 'Título visible del artículo.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  title!: string;

  @ApiPropertyOptional({
    example: 'Consejos prácticos para estudiantes en etapas de alta exigencia.',
    description: 'Resumen breve del artículo.',
  })
  @Transform(({ value }: { value: unknown }) => nullableTrimString(value))
  @IsOptional()
  @IsString()
  excerpt?: string | null;

  @ApiProperty({
    example:
      'La ansiedad académica puede aparecer en periodos de evaluación, cambios de rutina o sobrecarga de responsabilidades...',
    description: 'Contenido completo del artículo.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  content!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/images/articulo.webp',
    description: 'URL de imagen principal del artículo.',
  })
  @Transform(({ value }: { value: unknown }) => nullableTrimString(value))
  @IsOptional()
  @IsUrl()
  cover_image_url?: string | null;

  @ApiPropertyOptional({
    example: 'Estudiante organizando su semana de estudio.',
    description: 'Texto alternativo de la imagen principal.',
  })
  @Transform(({ value }: { value: unknown }) => nullableTrimString(value))
  @IsOptional()
  @IsString()
  cover_image_alt?: string | null;

  @ApiPropertyOptional({
    example: 'Equipo Vive Tu Mente',
    description: 'Nombre visible de la autoría.',
  })
  @Transform(({ value }: { value: unknown }) => nullableTrimString(value))
  @IsOptional()
  @IsString()
  author_name?: string | null;

  @ApiPropertyOptional({
    example: 'Bienestar',
    description: 'Categoría del artículo.',
  })
  @Transform(({ value }: { value: unknown }) => nullableTrimString(value))
  @IsOptional()
  @IsString()
  category?: string | null;

  @ApiProperty({
    example: 'draft',
    enum: ['draft', 'published'],
    description: 'Estado inicial permitido para creación administrativa.',
  })
  @IsIn(['draft', 'published'])
  status!: Extract<ArticleStatus, 'draft' | 'published'>;

  @ApiPropertyOptional({
    example: false,
    description: 'Define si el artículo será destacado.',
  })
  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;
}
