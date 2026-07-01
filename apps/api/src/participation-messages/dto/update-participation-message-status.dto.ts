import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateParticipationMessageStatusDto {
  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el mensaje fue leído.',
  })
  @IsOptional()
  @IsBoolean()
  is_read?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el mensaje fue marcado como destacado.',
  })
  @IsOptional()
  @IsBoolean()
  is_starred?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si la persona ya fue contactada.',
  })
  @IsOptional()
  @IsBoolean()
  is_contacted?: boolean;
}
