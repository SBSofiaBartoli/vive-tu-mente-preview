import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import type { TestimonialRole, TestimonialStatus } from '../testimonial.types';

const testimonialStatuses: TestimonialStatus[] = [
  'pending',
  'approved',
  'rejected',
];

const testimonialRoles: TestimonialRole[] = [
  'participant',
  'professional',
  'alliance',
  'company',
  'institution',
  'organization',
];

export class ListTestimonialsAdminQueryDto {
  @ApiPropertyOptional({
    example: 'pending',
    enum: testimonialStatuses,
    description: 'Estado opcional para filtrar testimonios.',
  })
  @IsOptional()
  @IsIn(testimonialStatuses)
  status?: TestimonialStatus;

  @ApiPropertyOptional({
    example: 'participant',
    enum: testimonialRoles,
    description: 'Rol opcional para filtrar testimonios.',
  })
  @IsOptional()
  @IsIn(testimonialRoles)
  role?: TestimonialRole;

  @ApiPropertyOptional({
    example: true,
    description: 'Permite filtrar testimonios destacados o no destacados.',
  })
  @IsOptional()
  @IsBooleanString()
  is_featured?: string;

  @ApiPropertyOptional({
    example: 'María',
    description: 'Texto para buscar por nombre, taller o comentario.',
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
