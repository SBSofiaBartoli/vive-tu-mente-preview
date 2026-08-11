import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { AdminRolesGuard } from '../auth/admin-roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateDonationReportDto } from './dto/create-donation-report.dto';
import { DonationReportResponseDto } from './dto/donation-report-response.dto';
import { ListDonationReportsAdminQueryDto } from './dto/list-donation-reports-admin-query.dto';
import { PaginatedDonationReportsResponseDto } from './dto/paginated-donation-reports-response.dto';
import { UpdateDonationReportStatusDto } from './dto/update-donation-report-status.dto';
import { DonationReportsService } from './donation-reports.service';

@ApiTags('Donation Reports')
@Controller('donation-reports')
export class DonationReportsController {
  constructor(
    private readonly donationReportsService: DonationReportsService,
  ) {}

  @ApiOperation({
    summary: 'Informar donación',
    description:
      'Recibe informes públicos de donación con datos de contacto, monto y comprobante asociado.',
  })
  @ApiResponse({
    status: 201,
    description: 'Informe de donación recibido correctamente.',
    type: DonationReportResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos en el formulario de donación.',
  })
  @Post()
  create(@Body() createDonationReportDto: CreateDonationReportDto) {
    return this.donationReportsService.create(createDonationReportDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar informes de donación',
    description:
      'Permite listar informes de donación desde el dashboard administrativo.',
  })
  @ApiQuery({ name: 'status', required: false, example: 'pending' })
  @ApiQuery({ name: 'search', required: false, example: 'maria@email.com' })
  @ApiResponse({
    status: 200,
    description: 'Listado administrativo de informes de donación.',
    type: PaginatedDonationReportsResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token ausente, inválido o expirado.',
  })
  @ApiResponse({
    status: 403,
    description: 'El usuario no tiene permisos administrativos suficientes.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'reviewer')
  @Get('admin')
  findAllForAdmin(@Query() query: ListDonationReportsAdminQueryDto) {
    return this.donationReportsService.findAllForAdmin(query);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar estado de informe de donación',
    description:
      'Permite confirmar, rechazar o archivar un informe de donación desde administración.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador único del informe de donación.',
    example: '9f4b8d7a-1234-4567-8901-abcdef123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del informe actualizado correctamente.',
    type: DonationReportResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Informe de donación no encontrado.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'reviewer')
  @Patch('admin/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateDonationReportStatusDto,
  ) {
    return this.donationReportsService.updateStatus(id, updateStatusDto);
  }
}
