import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateArticleFeaturedDto {
  @ApiProperty({
    example: true,
    description:
      'Define si el artículo publicado se muestra como destacado en el blog y en secciones públicas.',
  })
  @IsBoolean()
  is_featured!: boolean;
}
