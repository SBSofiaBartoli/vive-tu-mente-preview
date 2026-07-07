import { ApiProperty } from '@nestjs/swagger';

export class FaqResponseDto {
  @ApiProperty({ example: '9f4b8d7a-1234-4567-8901-abcdef123456' })
  id!: string;

  @ApiProperty({ example: '¿Cómo puedo participar en un taller?' })
  question!: string;

  @ApiProperty({
    example:
      'Podés completar el formulario de participación y el equipo se pondrá en contacto con vos.',
  })
  answer!: string;

  @ApiProperty({ example: 'programas' })
  category!: string;

  @ApiProperty({ example: 1 })
  sort_order!: number;

  @ApiProperty({ example: true })
  is_active!: boolean;

  @ApiProperty({ example: '2026-07-01T12:00:00.000Z' })
  created_at!: string;

  @ApiProperty({ example: '2026-07-01T12:00:00.000Z' })
  updated_at!: string;
}
