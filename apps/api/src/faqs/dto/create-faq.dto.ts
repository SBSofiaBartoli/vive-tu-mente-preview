import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

const trimString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateFaqDto {
  @ApiProperty({
    example: '¿Cómo puedo participar en un taller?',
    description: 'Pregunta visible para los usuarios del sitio.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  question!: string;

  @ApiProperty({
    example:
      'Podés completar el formulario de participación y el equipo se pondrá en contacto con vos.',
    description: 'Respuesta desplegable asociada a la pregunta.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  answer!: string;

  @ApiPropertyOptional({
    example: 'programas',
    description:
      'Categoría utilizada para agrupar preguntas frecuentes por sección.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Orden visual de la pregunta dentro de su categoría.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sort_order?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si la pregunta debe mostrarse públicamente.',
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
