import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

const trimString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class TrackVisitDto {
  @ApiProperty({
    example: 'visitor_abc123',
    description:
      'Clave anónima generada desde el frontend para identificar una visita dentro de una ventana de tiempo.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  visitor_key!: string;

  @ApiPropertyOptional({
    example: '/',
    description: 'Ruta de la página visitada. Por defecto se usa la home.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsOptional()
  @IsString()
  page_path?: string;
}
