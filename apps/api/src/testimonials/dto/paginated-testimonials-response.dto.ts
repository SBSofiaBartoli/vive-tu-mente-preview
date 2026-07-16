import { ApiProperty } from '@nestjs/swagger';
import { TestimonialResponseDto } from './testimonial-response.dto';

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

export class PaginatedTestimonialsResponseDto {
  @ApiProperty({ type: [TestimonialResponseDto] })
  items!: TestimonialResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
