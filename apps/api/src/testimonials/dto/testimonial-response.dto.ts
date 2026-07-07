import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TestimonialResponseDto {
  @ApiProperty({ example: '9f4b8d7a-1234-4567-8901-abcdef123456' })
  id!: string;

  @ApiProperty({ example: 'María González' })
  full_name!: string;

  @ApiProperty({
    example: 'participant',
    enum: [
      'participant',
      'professional',
      'alliance',
      'company',
      'institution',
      'organization',
    ],
  })
  role!: string;

  @ApiPropertyOptional({ example: 'Taller de bienestar emocional' })
  workshop_name!: string | null;

  @ApiProperty({
    example:
      'El taller me ayudó a entender mejor mis emociones y encontrar herramientas para organizarme.',
  })
  comment!: string;

  @ApiProperty({
    example: 'pending',
    enum: ['pending', 'approved', 'rejected'],
  })
  status!: string;

  @ApiProperty({ example: false })
  is_featured!: boolean;

  @ApiPropertyOptional({ example: null })
  rejection_reason!: string | null;

  @ApiPropertyOptional({ example: null })
  reviewed_at!: string | null;

  @ApiProperty({ example: '2026-07-01T12:00:00.000Z' })
  created_at!: string;

  @ApiProperty({ example: '2026-07-01T12:00:00.000Z' })
  updated_at!: string;
}
