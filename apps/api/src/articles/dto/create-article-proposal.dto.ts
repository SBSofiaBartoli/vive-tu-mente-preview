import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

const trimString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

const trimLowercaseString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class CreateArticleProposalDto {
  @ApiProperty({
    example: 'Herramientas para manejar la ansiedad académica',
    description: 'Título propuesto para el artículo.',
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
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiProperty({
    example:
      'La ansiedad académica puede aparecer en periodos de evaluación, cambios de rutina o sobrecarga de responsabilidades...',
    description: 'Contenido completo propuesto para el artículo.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  content!: string;

  @ApiPropertyOptional({
    example: 'Dra. Camila Rojas',
    description: 'Nombre del autor visible del artículo.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsOptional()
  @IsString()
  author_name?: string;

  @ApiPropertyOptional({
    example: 'Bienestar',
    description: 'Categoría sugerida para el artículo.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    example: 'Camila Rojas',
    description: 'Nombre de la persona que envía la propuesta.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  submitted_by_name!: string;

  @ApiProperty({
    example: 'camila@email.com',
    description: 'Correo de contacto de la persona que envía la propuesta.',
  })
  @Transform(({ value }: { value: unknown }) => trimLowercaseString(value))
  @IsEmail()
  submitted_by_email!: string;
}
