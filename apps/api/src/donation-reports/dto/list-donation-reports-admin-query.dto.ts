import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import type { DonationReportStatus } from '../donation-report.types';

const donationReportStatuses: DonationReportStatus[] = [
  'pending',
  'confirmed',
  'rejected',
  'archived',
];

export class ListDonationReportsAdminQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiPropertyOptional({
    example: 'pending',
    enum: donationReportStatuses,
  })
  @IsOptional()
  @IsIn(donationReportStatuses)
  status?: DonationReportStatus;

  @ApiPropertyOptional({ example: 'maria@email.com' })
  @IsOptional()
  @IsString()
  search?: string;
}
