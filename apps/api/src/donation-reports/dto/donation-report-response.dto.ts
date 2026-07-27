import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DonationReportResponseDto {
  @ApiProperty({ example: '9f4b8d7a-1234-4567-8901-abcdef123456' })
  id!: string;

  @ApiProperty({ example: 'María González' })
  donor_name!: string;

  @ApiProperty({ example: 'maria@email.com' })
  donor_email!: string;

  @ApiProperty({ example: 15000 })
  amount!: number;

  @ApiPropertyOptional({
    example: '9f4b8d7a-1234-4567-8901-abcdef123456',
  })
  receipt_media_file_id!: string | null;

  @ApiProperty({ example: 'pending' })
  status!: string;

  @ApiPropertyOptional({ example: 'Comprobante validado correctamente.' })
  review_notes!: string | null;

  @ApiPropertyOptional({
    example: 'El comprobante no coincide con el monto informado.',
  })
  rejection_reason!: string | null;

  @ApiPropertyOptional({ example: '2026-07-24T18:30:00.000Z' })
  reviewed_at!: string | null;

  @ApiProperty({ example: '2026-07-24T18:30:00.000Z' })
  created_at!: string;

  @ApiProperty({ example: '2026-07-24T18:30:00.000Z' })
  updated_at!: string;
}
