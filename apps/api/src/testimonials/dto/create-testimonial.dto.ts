import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import type { TestimonialRole } from '../testimonial.types';

const trimString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

const testimonialRoles: TestimonialRole[] = [
  'participant',
  'professional',
  'alliance',
  'company',
  'institution',
  'organization',
];

export class CreateTestimonialDto {
  @ApiProperty({
    example: 'María González',
    description: 'Nombre y apellido de la persona que deja el testimonio.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  full_name!: string;

  @ApiProperty({
    example: 'participant',
    enum: testimonialRoles,
    description:
      'Tipo de vínculo de la persona con la fundación o con la actividad.',
  })
  @IsIn(testimonialRoles)
  role!: TestimonialRole;

  @ApiPropertyOptional({
    example: 'Taller de bienestar emocional',
    description: 'Nombre del taller o actividad a la que asistió, si aplica.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsOptional()
  @IsString()
  workshop_name?: string;

  @ApiProperty({
    example:
      'El taller me ayudó a entender mejor mis emociones y encontrar herramientas para organizarme.',
    description:
      'Comentario que será revisado por administración antes de mostrarse en el sitio.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  comment!: string;
}
