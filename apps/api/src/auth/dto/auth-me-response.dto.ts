import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AuthUserResponseDto {
  @ApiProperty({ example: '9f4b8d7a-1234-4567-8901-abcdef123456' })
  id!: string;

  @ApiPropertyOptional({ example: 'admin@vivetumente.org' })
  email!: string | undefined;
}

class AdminProfileResponseDto {
  @ApiProperty({ example: '9f4b8d7a-1234-4567-8901-abcdef123456' })
  id!: string;

  @ApiProperty({ example: '9f4b8d7a-1234-4567-8901-abcdef123456' })
  user_id!: string;

  @ApiProperty({ example: 'admin', enum: ['admin', 'editor', 'reviewer'] })
  role!: string;

  @ApiProperty({ example: true })
  is_active!: boolean;

  @ApiPropertyOptional({ example: 'Administradora Vive Tu Mente' })
  display_name!: string | null;

  @ApiProperty({ example: '2026-07-01T12:00:00.000Z' })
  created_at!: string;

  @ApiProperty({ example: '2026-07-01T12:00:00.000Z' })
  updated_at!: string;
}

export class AuthMeResponseDto {
  @ApiProperty({ type: AuthUserResponseDto })
  user!: AuthUserResponseDto;

  @ApiProperty({ type: AdminProfileResponseDto })
  profile!: AdminProfileResponseDto;
}
