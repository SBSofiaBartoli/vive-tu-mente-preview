import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ListFaqsAdminQueryDto {
  @ApiPropertyOptional({
    example: 'general',
    description: 'Categoría opcional para filtrar preguntas frecuentes.',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: 'participar',
    description: 'Texto para buscar por pregunta o respuesta.',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Permite filtrar preguntas activas o inactivas.',
  })
  @IsOptional()
  @IsBooleanString()
  is_active?: string;

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
