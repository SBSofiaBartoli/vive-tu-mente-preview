import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateParticipationMessageDto {
  @IsString()
  @MinLength(2)
  full_name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  interest_area?: string;

  @IsString()
  @MinLength(10)
  message!: string;
}
