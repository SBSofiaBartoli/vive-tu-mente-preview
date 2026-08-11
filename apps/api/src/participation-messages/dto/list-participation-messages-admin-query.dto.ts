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

export class ListParticipationMessagesAdminQueryDto {
  @ApiPropertyOptional({ example: 'false' })
  @IsOptional()
  @IsBooleanString()
  is_read?: string;

  @ApiPropertyOptional({ example: 'true' })
  @IsOptional()
  @IsBooleanString()
  is_starred?: string;

  @ApiPropertyOptional({ example: 'false' })
  @IsOptional()
  @IsBooleanString()
  is_contacted?: string;

  @ApiPropertyOptional({
    example: 'voluntariado',
    description: 'Área de interés opcional para filtrar mensajes.',
  })
  @IsOptional()
  @IsString()
  interest_area?: string;

  @ApiPropertyOptional({
    example: 'Sofía',
    description: 'Texto para buscar por nombre, email, teléfono o mensaje.',
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
