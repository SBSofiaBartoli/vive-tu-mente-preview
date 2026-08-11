import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EducationTipResponseDto {
  @ApiProperty({ example: '9f4b8d7a-1234-4567-8901-abcdef123456' })
  id!: string;

  @ApiProperty({ example: 'ia-aplicada' })
  segment_key!: string;

  @ApiProperty({ example: 'Prompt para organizar tu semana' })
  title!: string;

  @ApiProperty({
    example:
      'Usá este prompt: "Organizá mi semana considerando estudio, descanso y tres objetivos prioritarios".',
  })
  content!: string;

  @ApiPropertyOptional({
    example: 'https://vivetumente.org/recursos/guia-productividad.pdf',
  })
  resource_url!: string | null;

  @ApiProperty({ example: true })
  is_active!: boolean;

  @ApiPropertyOptional({ example: '2026-07-01' })
  starts_at!: string | null;

  @ApiPropertyOptional({ example: '2026-07-07' })
  ends_at!: string | null;

  @ApiProperty({ example: '2026-07-01T12:00:00.000Z' })
  created_at!: string;

  @ApiProperty({ example: '2026-07-01T12:00:00.000Z' })
  updated_at!: string;
}
