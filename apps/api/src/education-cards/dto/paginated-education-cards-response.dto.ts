import { ApiProperty } from '@nestjs/swagger';
import { EducationCardResponseDto } from './education-card-response.dto';

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

export class PaginatedEducationCardsResponseDto {
  @ApiProperty({ type: [EducationCardResponseDto] })
  items!: EducationCardResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
