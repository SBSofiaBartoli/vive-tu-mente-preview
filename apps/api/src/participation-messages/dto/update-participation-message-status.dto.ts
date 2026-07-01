import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateParticipationMessageStatusDto {
  @IsOptional()
  @IsBoolean()
  is_read?: boolean;

  @IsOptional()
  @IsBoolean()
  is_starred?: boolean;

  @IsOptional()
  @IsBoolean()
  is_contacted?: boolean;
}
