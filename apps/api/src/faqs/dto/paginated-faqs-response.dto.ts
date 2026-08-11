import { ApiProperty } from '@nestjs/swagger';
import { FaqResponseDto } from './faq-response.dto';

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

export class PaginatedFaqsResponseDto {
  @ApiProperty({ type: [FaqResponseDto] })
  items!: FaqResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
