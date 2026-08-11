import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

const trimString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class RejectTestimonialDto {
  @ApiProperty({
    example: 'El testimonio contiene información sensible o no verificable.',
    description:
      'Motivo interno por el cual el testimonio fue rechazado por administración.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  rejection_reason!: string;
}
