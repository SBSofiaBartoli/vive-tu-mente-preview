import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MediaFileResponseDto {
  @ApiProperty({ example: '9f4b8d7a-1234-4567-8901-abcdef123456' })
  id!: string;

  @ApiProperty({ example: 'guia-bienestar.pdf' })
  original_name!: string;

  @ApiProperty({ example: 'donations/2026/guia-bienestar.pdf' })
  storage_path!: string;

  @ApiPropertyOptional({
    example:
      'https://example.supabase.co/storage/v1/object/public/media/donations/2026/guia-bienestar.pdf',
  })
  public_url!: string | null;

  @ApiProperty({ example: 'application/pdf' })
  mime_type!: string;

  @ApiProperty({ example: 524288 })
  file_size!: number;

  @ApiProperty({ example: 'donation' })
  section!: string;

  @ApiProperty({
    example: 'pending',
    enum: ['pending', 'changes_requested', 'approved', 'rejected', 'archived'],
  })
  status!: string;

  @ApiPropertyOptional({ example: 'María González' })
  uploaded_by_name!: string | null;

  @ApiPropertyOptional({ example: 'maria@email.com' })
  uploaded_by_email!: string | null;

  @ApiPropertyOptional({
    example: 'Se solicita agregar la fuente del dato citado.',
  })
  review_notes!: string | null;

  @ApiPropertyOptional({
    example: 'El archivo no corresponde al objetivo de la sección.',
  })
  rejection_reason!: string | null;

  @ApiPropertyOptional({ example: null })
  reviewed_at!: string | null;

  @ApiProperty({ example: '2026-07-01T12:00:00.000Z' })
  created_at!: string;

  @ApiProperty({ example: '2026-07-01T12:00:00.000Z' })
  updated_at!: string;
}
