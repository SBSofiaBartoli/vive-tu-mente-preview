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

export class CreateEducationCardDto {
  @ApiProperty({
    example: 'ia-aplicada',
    description:
      'Clave única del segmento educativo. También se usa para vincular tips.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  segment_key!: string;

  @ApiProperty({
    example: 'IA Aplicada',
    description: 'Título visible de la card educativa.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title!: string;

  @ApiProperty({
    example:
      'Herramientas prácticas para usar inteligencia artificial de forma productiva y responsable.',
    description: 'Descripción visible dentro de la card educativa.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description!: string;

  @ApiProperty({
    example: 'bot',
    description:
      'Nombre del icono que el frontend debe renderizar desde la librería acordada.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  icon_name!: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Orden visual de la card dentro de la sección Educación.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sort_order?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si la card debe mostrarse públicamente.',
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
