import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TrackVisitDto } from './dto/track-visit.dto';
import { VisitCounterResponseDto } from './dto/visit-counter-response.dto';
import { VisitCounterService } from './visit-counter.service';

@ApiTags('Visit Counter')
@Controller('visits')
export class VisitCounterController {
  constructor(private readonly visitCounterService: VisitCounterService) {}

  @ApiOperation({
    summary: 'Obtener contador de visitas',
    description:
      'Devuelve el total de visitas registradas para una página específica.',
  })
  @ApiQuery({
    name: 'pagePath',
    required: false,
    example: '/',
    description: 'Ruta de la página consultada. Por defecto se usa la home.',
  })
  @ApiResponse({
    status: 200,
    description: 'Contador de visitas obtenido correctamente.',
    type: VisitCounterResponseDto,
  })
  @Get('counter')
  getCounter(@Query('pagePath') pagePath?: string) {
    return this.visitCounterService.getCounter(pagePath);
  }

  @ApiOperation({
    summary: 'Registrar visita',
    description:
      'Registra una visita anónima si el mismo visitante no fue contado recientemente dentro de la ventana definida.',
  })
  @ApiResponse({
    status: 201,
    description:
      'Visita registrada o detectada como ya contabilizada recientemente.',
    type: VisitCounterResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Los datos enviados no cumplen con las validaciones requeridas.',
  })
  @Post('track')
  trackVisit(@Body() trackVisitDto: TrackVisitDto) {
    return this.visitCounterService.trackVisit(trackVisitDto);
  }
}
