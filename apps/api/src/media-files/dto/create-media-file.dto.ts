import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from 'class-validator';

const trimString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

const trimLowercaseString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class CreateMediaFileDto {
  @ApiProperty({
    example: 'guia-bienestar.pdf',
    description: 'Nombre original del archivo subido.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  original_name!: string;

  @ApiProperty({
    example: 'donations/2026/guia-bienestar.pdf',
    description: 'Ruta del archivo dentro de Supabase Storage.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  storage_path!: string;

  @ApiPropertyOptional({
    example:
      'https://example.supabase.co/storage/v1/object/public/media/donations/2026/guia-bienestar.pdf',
    description: 'URL pública del archivo, si corresponde.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsOptional()
  @IsUrl()
  public_url?: string;

  @ApiProperty({
    example: 'application/pdf',
    description: 'Tipo MIME del archivo.',
  })
  @Transform(({ value }: { value: unknown }) => trimLowercaseString(value))
  @IsString()
  @IsNotEmpty()
  mime_type!: string;

  @ApiProperty({
    example: 524288,
    description: 'Tamaño del archivo en bytes.',
  })
  @IsInt()
  @Min(1)
  file_size!: number;

  @ApiPropertyOptional({
    example: 'donation',
    description: 'Sección del sitio a la que pertenece el archivo.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsOptional()
  @IsString()
  section?: string;

  @ApiPropertyOptional({
    example: 'María González',
    description: 'Nombre de la persona que subió el archivo.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsOptional()
  @IsString()
  @MinLength(2)
  uploaded_by_name?: string;

  @ApiPropertyOptional({
    example: 'maria@email.com',
    description: 'Email de contacto de la persona que subió el archivo.',
  })
  @Transform(({ value }: { value: unknown }) => trimLowercaseString(value))
  @IsOptional()
  @IsEmail()
  uploaded_by_email?: string;
}
