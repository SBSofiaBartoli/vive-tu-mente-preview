import { ApiProperty } from '@nestjs/swagger';

export class VisitCounterResponseDto {
  @ApiProperty({ example: '/' })
  page_path!: string;

  @ApiProperty({ example: 1250 })
  total_visits!: number;
}
