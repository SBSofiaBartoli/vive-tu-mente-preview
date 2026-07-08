import { ApiProperty } from '@nestjs/swagger';

export class EducationCardResponseDto {
  @ApiProperty({ example: '9f4b8d7a-1234-4567-8901-abcdef123456' })
  id!: string;

  @ApiProperty({ example: 'ia-aplicada' })
  segment_key!: string;

  @ApiProperty({ example: 'IA Aplicada' })
  title!: string;

  @ApiProperty({
    example:
      'Herramientas prácticas para usar inteligencia artificial de forma productiva y responsable.',
  })
  description!: string;

  @ApiProperty({ example: 'bot' })
  icon_name!: string;

  @ApiProperty({ example: 1 })
  sort_order!: number;

  @ApiProperty({ example: true })
  is_active!: boolean;

  @ApiProperty({ example: '2026-07-01T12:00:00.000Z' })
  created_at!: string;

  @ApiProperty({ example: '2026-07-01T12:00:00.000Z' })
  updated_at!: string;
}
