import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ContentService } from './content.service';

@ApiTags('Site Content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @ApiOperation({
    summary: 'Obtener contenido editable por clave',
    description:
      'Devuelve una sección editable del sitio a partir de su clave identificadora.',
  })
  @ApiParam({
    name: 'sectionKey',
    example: 'home-hero',
    description: 'Clave única de la sección editable.',
  })
  @Get(':sectionKey')
  getBySectionKey(@Param('sectionKey') sectionKey: string) {
    return this.contentService.getBySectionKey(sectionKey);
  }
}
