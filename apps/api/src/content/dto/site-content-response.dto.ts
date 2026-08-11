import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SiteContentResponseDto {
  @ApiProperty({ example: '9f4b8d7a-1234-4567-8901-abcdef123456' })
  id!: string;

  @ApiProperty({ example: 'home-hero' })
  section_key!: string;

  @ApiPropertyOptional({ example: 'Vive Tu Mente' })
  title!: string | null;

  @ApiPropertyOptional({
    example: 'Empoderando el potencial de jóvenes y comunidades.',
  })
  subtitle!: string | null;

  @ApiPropertyOptional({
    example: 'Texto principal editable de la sección.',
  })
  body!: string | null;

  @ApiPropertyOptional({
    example: { ctaLabel: 'Conocé nuestros programas', ctaHref: '/programs' },
  })
  metadata!: Record<string, unknown> | null;

  @ApiProperty({ example: '2026-07-01T12:00:00.000Z' })
  created_at!: string;

  @ApiProperty({ example: '2026-07-01T12:00:00.000Z' })
  updated_at!: string;
}
