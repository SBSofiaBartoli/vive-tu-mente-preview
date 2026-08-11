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

export class ListEducationTipsAdminQueryDto {
  @ApiPropertyOptional({
    example: 'ia-aplicada',
    description: 'Segmento opcional para filtrar tips educativos.',
  })
  @IsOptional()
  @IsString()
  segment_key?: string;

  @ApiPropertyOptional({
    example: 'agenda',
    description: 'Texto para buscar por título o contenido.',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Permite filtrar tips activos o inactivos.',
  })
  @IsOptional()
  @IsBooleanString()
  is_active?: string;

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
