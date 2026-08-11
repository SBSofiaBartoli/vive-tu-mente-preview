import { ApiProperty } from '@nestjs/swagger';
import { EducationTipResponseDto } from './education-tip-response.dto';

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

export class PaginatedEducationTipsResponseDto {
  @ApiProperty({ type: [EducationTipResponseDto] })
  items!: EducationTipResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
