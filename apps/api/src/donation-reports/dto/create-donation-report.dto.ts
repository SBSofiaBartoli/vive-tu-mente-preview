import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

const trimString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

const trimLowercaseString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class CreateDonationReportDto {
  @ApiProperty({
    example: 'María González',
    description: 'Nombre completo de la persona que informa la donación.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  donor_name!: string;

  @ApiProperty({
    example: 'maria@email.com',
    description:
      'Email de contacto para enviar recibo o solicitar aclaraciones.',
  })
  @Transform(({ value }: { value: unknown }) => trimLowercaseString(value))
  @IsEmail()
  donor_email!: string;

  @ApiProperty({
    example: 15000,
    description: 'Monto informado de la donación.',
  })
  @IsNumber()
  @Min(1)
  amount!: number;

  @ApiPropertyOptional({
    example: '9f4b8d7a-1234-4567-8901-abcdef123456',
    description: 'ID del archivo registrado como comprobante de transferencia.',
  })
  @IsOptional()
  @IsUUID()
  receipt_media_file_id?: string;
}
