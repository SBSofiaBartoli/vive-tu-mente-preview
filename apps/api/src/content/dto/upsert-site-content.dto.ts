import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

const trimString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class UpsertSiteContentDto {
  @ApiProperty({
    example: 'home-hero',
    description: 'Clave única de la sección editable.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  section_key!: string;

  @ApiPropertyOptional({
    example: 'Vive Tu Mente',
    description: 'Título editable de la sección.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string;

  @ApiPropertyOptional({
    example: 'Empoderando el potencial de jóvenes y comunidades.',
    description: 'Subtítulo o bajada editable de la sección.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({
    example: 'Texto principal de la sección editable.',
    description: 'Contenido principal editable.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional({
    example: { ctaLabel: 'Conocé nuestros programas', ctaHref: '/programs' },
    description: 'Información adicional flexible en formato JSON.',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el contenido está activo.',
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
