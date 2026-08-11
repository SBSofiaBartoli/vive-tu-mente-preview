import { ApiProperty } from '@nestjs/swagger';
import { MediaFileResponseDto } from './media-file-response.dto';

class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 5 })
  total_pages!: number;
}

export class PaginatedMediaFilesResponseDto {
  @ApiProperty({ type: [MediaFileResponseDto] })
  items!: MediaFileResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
