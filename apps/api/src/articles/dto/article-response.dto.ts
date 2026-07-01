import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ArticleResponseDto {
  @ApiProperty({ example: '9f4b8d7a-1234-4567-8901-abcdef123456' })
  id!: string;

  @ApiProperty({ example: 'Herramientas para manejar la ansiedad académica' })
  title!: string;

  @ApiProperty({ example: 'herramientas-ansiedad-academica' })
  slug!: string;

  @ApiPropertyOptional({
    example: 'Consejos prácticos para estudiantes en etapas de alta exigencia.',
  })
  excerpt!: string | null;

  @ApiProperty({
    example: 'Contenido completo del artículo...',
  })
  content!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/images/articulo.webp',
  })
  cover_image_url!: string | null;

  @ApiPropertyOptional({
    example: 'Estudiante organizando su semana de estudio.',
  })
  cover_image_alt!: string | null;

  @ApiPropertyOptional({ example: 'Dra. Camila Rojas' })
  author_name!: string | null;

  @ApiPropertyOptional({ example: 'Bienestar' })
  category!: string | null;

  @ApiProperty({
    example: 'published',
    enum: ['draft', 'pending_review', 'published', 'rejected', 'archived'],
  })
  status!: string;

  @ApiProperty({ example: true })
  is_featured!: boolean;

  @ApiPropertyOptional({ example: 'Camila Rojas' })
  submitted_by_name!: string | null;

  @ApiPropertyOptional({ example: 'camila@email.com' })
  submitted_by_email!: string | null;

  @ApiPropertyOptional({
    example: 'El contenido requiere fuentes verificables.',
  })
  rejection_reason!: string | null;

  @ApiPropertyOptional({ example: '2026-07-01T12:00:00.000Z' })
  published_at!: string | null;

  @ApiProperty({ example: '2026-07-01T12:00:00.000Z' })
  created_at!: string;

  @ApiProperty({ example: '2026-07-01T12:00:00.000Z' })
  updated_at!: string;
}
