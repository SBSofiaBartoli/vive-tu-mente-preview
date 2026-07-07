import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {
  @ApiProperty({ example: 'guia-bienestar.pdf' })
  original_name!: string;

  @ApiProperty({ example: 'general/2026/guia-bienestar-1720000000000.pdf' })
  storage_path!: string;

  @ApiProperty({
    example:
      'https://example.supabase.co/storage/v1/object/public/media/general/2026/guia-bienestar-1720000000000.pdf',
  })
  public_url!: string;

  @ApiProperty({ example: 'application/pdf' })
  mime_type!: string;

  @ApiProperty({ example: 524288 })
  file_size!: number;
}
