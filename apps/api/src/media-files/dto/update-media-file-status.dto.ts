import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import type { MediaFileStatus } from '../media-file.types';

const trimString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

const mediaFileStatuses: MediaFileStatus[] = [
  'pending',
  'changes_requested',
  'approved',
  'rejected',
  'archived',
];

export class UpdateMediaFileStatusDto {
  @ApiProperty({
    example: 'approved',
    enum: mediaFileStatuses,
    description: 'Nuevo estado editorial del archivo.',
  })
  @IsIn(mediaFileStatuses)
  status!: MediaFileStatus;

  @ApiPropertyOptional({
    example:
      'Se solicita ajustar el documento para incluir fuente del dato mencionado.',
    description:
      'Observaciones internas o cambios solicitados por administración.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsOptional()
  @IsString()
  @MinLength(5)
  review_notes?: string;

  @ApiPropertyOptional({
    example: 'El archivo no corresponde al objetivo de la sección.',
    description: 'Motivo de rechazo, si el archivo fue rechazado.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsOptional()
  @IsString()
  @MinLength(5)
  rejection_reason?: string;
}
