import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Verificar estado de la API',
    description:
      'Endpoint simple para comprobar que el backend se encuentra activo.',
  })
  @ApiResponse({
    status: 200,
    description: 'La API se encuentra activa.',
  })
  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }
}
