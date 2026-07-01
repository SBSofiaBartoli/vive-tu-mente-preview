import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { SiteContentResponseDto } from './dto/site-content-response.dto';

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
  @ApiResponse({
    status: 200,
    description: 'Contenido editable encontrado.',
    type: SiteContentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No existe contenido para la clave indicada.',
  })
  @Get(':sectionKey')
  getBySectionKey(@Param('sectionKey') sectionKey: string) {
    return this.contentService.getBySectionKey(sectionKey);
  }
}
