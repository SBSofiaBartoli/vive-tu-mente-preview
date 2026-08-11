import { ApiProperty } from '@nestjs/swagger';
import { ParticipationMessageResponseDto } from './participation-message-response.dto';

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

export class PaginatedParticipationMessagesResponseDto {
  @ApiProperty({ type: [ParticipationMessageResponseDto] })
  items!: ParticipationMessageResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
