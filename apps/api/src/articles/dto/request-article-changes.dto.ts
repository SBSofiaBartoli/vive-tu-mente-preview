import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

const trimString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class RequestArticleChangesDto {
  @ApiProperty({
    example:
      'El artículo es interesante, pero necesitamos que agregues la fuente del dato citado y ajustes el cierre.',
    description:
      'Observaciones o cambios solicitados por administración antes de aprobar el artículo.',
  })
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  review_notes!: string;
}
