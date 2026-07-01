import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ParticipationMessageResponseDto {
  @ApiProperty({ example: '9f4b8d7a-1234-4567-8901-abcdef123456' })
  id!: string;

  @ApiProperty({ example: 'María González' })
  full_name!: string;

  @ApiProperty({ example: 'maria@email.com' })
  email!: string;

  @ApiPropertyOptional({ example: '+56 9 1234 5678' })
  phone!: string | null;

  @ApiProperty({ example: 'Voluntariado' })
  interest_area!: string;

  @ApiProperty({
    example: 'Me gustaría participar como voluntaria en futuras actividades.',
  })
  message!: string;

  @ApiProperty({ example: false })
  is_read!: boolean;

  @ApiProperty({ example: false })
  is_starred!: boolean;

  @ApiProperty({ example: false })
  is_contacted!: boolean;

  @ApiProperty({ example: '2026-07-01T12:00:00.000Z' })
  created_at!: string;

  @ApiProperty({ example: '2026-07-01T12:00:00.000Z' })
  updated_at!: string;
}
