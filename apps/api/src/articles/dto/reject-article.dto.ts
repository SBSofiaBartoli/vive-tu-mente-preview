import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

const trimString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class RejectArticleDto {
  @ApiProperty({
    example:
      'El contenido requiere fuentes verificables antes de ser publicado.',
    description: 'Motivo por el cual se rechaza la propuesta de artículo.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  rejection_reason!: string;
}
