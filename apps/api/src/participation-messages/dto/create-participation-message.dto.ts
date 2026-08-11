import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

const trimString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

const trimLowercaseString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class CreateParticipationMessageDto {
  @ApiProperty({
    example: 'María González',
    description: 'Nombre completo de la persona que envía el formulario.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  full_name!: string;

  @ApiProperty({
    example: 'maria@email.com',
    description: 'Correo electrónico de contacto.',
  })
  @Transform(({ value }: { value: unknown }) => trimLowercaseString(value))
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({
    example: '+56 9 1234 5678',
    description: 'Teléfono de contacto opcional.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'Voluntariado',
    description: 'Área de interés seleccionada por la persona.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  interest_area!: string;

  @ApiProperty({
    example: 'Me gustaría participar como voluntaria en futuras actividades.',
    description: 'Mensaje enviado desde el formulario de participación.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  message!: string;
}
