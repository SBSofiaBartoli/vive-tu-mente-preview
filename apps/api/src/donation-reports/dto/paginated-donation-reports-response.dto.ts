import { ApiProperty } from '@nestjs/swagger';
import { DonationReportResponseDto } from './donation-report-response.dto';

class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 25 })
  total!: number;

  @ApiProperty({ example: 3 })
  total_pages!: number;
}

export class PaginatedDonationReportsResponseDto {
  @ApiProperty({ type: DonationReportResponseDto, isArray: true })
  items!: DonationReportResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
