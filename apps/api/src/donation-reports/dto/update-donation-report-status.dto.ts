import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import type { DonationReportStatus } from '../donation-report.types';

const trimString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

const donationReportStatuses: DonationReportStatus[] = [
  'pending',
  'confirmed',
  'rejected',
  'archived',
];

export class UpdateDonationReportStatusDto {
  @ApiProperty({
    example: 'confirmed',
    enum: donationReportStatuses,
    description: 'Nuevo estado administrativo del informe de donación.',
  })
  @IsIn(donationReportStatuses)
  status!: DonationReportStatus;

  @ApiPropertyOptional({
    example: 'Comprobante validado correctamente.',
    description: 'Notas internas de revisión.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsOptional()
  @IsString()
  @MinLength(3)
  review_notes?: string;

  @ApiPropertyOptional({
    example: 'El comprobante no coincide con el monto informado.',
    description: 'Motivo visible o interno para rechazar el informe.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsOptional()
  @IsString()
  @MinLength(3)
  rejection_reason?: string;
}
