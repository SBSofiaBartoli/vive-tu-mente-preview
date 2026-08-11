import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateTestimonialFeaturedDto {
  @ApiProperty({
    example: true,
    description:
      'Indica si el testimonio debe mostrarse como destacado en el sitio.',
  })
  @IsBoolean()
  is_featured!: boolean;
}
