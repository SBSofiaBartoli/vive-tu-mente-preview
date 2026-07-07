import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

const trimString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateEducationTipDto {
  @ApiProperty({
    example: 'ia-aplicada',
    description:
      'Clave del segmento educativo al que pertenece el tip. Ejemplo: ia-aplicada, emprendimiento, finanzas.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  segment_key!: string;

  @ApiProperty({
    example: 'Prompt para organizar tu semana',
    description: 'Título corto del tip educativo.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title!: string;

  @ApiProperty({
    example:
      'Usá este prompt: "Organizá mi semana considerando estudio, descanso y tres objetivos prioritarios".',
    description: 'Contenido principal del tip educativo.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  content!: string;

  @ApiPropertyOptional({
    example: 'https://vivetumente.org/recursos/guia-productividad.pdf',
    description:
      'Enlace opcional a un recurso descargable o material complementario.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsOptional()
  @IsUrl()
  resource_url?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el tip puede mostrarse públicamente.',
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({
    example: '2026-07-01',
    description: 'Fecha desde la cual el tip puede mostrarse.',
  })
  @IsOptional()
  @IsDateString()
  starts_at?: string;

  @ApiPropertyOptional({
    example: '2026-07-07',
    description: 'Fecha hasta la cual el tip puede mostrarse.',
  })
  @IsOptional()
  @IsDateString()
  ends_at?: string;
}
