import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleProposalDto } from './dto/create-article-proposal.dto';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { AdminRolesGuard } from '../auth/admin-roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RejectArticleDto } from './dto/reject-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiOperation({
    summary: 'Listar artículos publicados',
    description:
      'Devuelve los artículos publicados visibles en el blog público.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de artículos publicados obtenido correctamente.',
    type: ArticleResponseDto,
    isArray: true,
  })
  @Get()
  findPublished() {
    return this.articlesService.findPublished();
  }

  @ApiOperation({
    summary: 'Listar artículos destacados',
    description: 'Devuelve artículos publicados marcados como destacados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de artículos destacados obtenido correctamente.',
    type: ArticleResponseDto,
    isArray: true,
  })
  @Get('featured')
  findFeatured() {
    return this.articlesService.findFeatured();
  }

  @ApiOperation({
    summary: 'Enviar propuesta de artículo',
    description:
      'Permite que una persona profesional envíe una propuesta de artículo para revisión administrativa.',
  })
  @ApiResponse({
    status: 201,
    description: 'Propuesta de artículo recibida correctamente.',
    type: ArticleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos en la propuesta.',
  })
  @Post('proposals')
  createProposal(@Body() createArticleProposalDto: CreateArticleProposalDto) {
    return this.articlesService.createProposal(createArticleProposalDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar artículos pendientes de revisión',
    description:
      'Permite a usuarios administrativos listar propuestas de artículos pendientes de revisión.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de propuestas pendientes obtenido correctamente.',
    type: ArticleResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Token ausente, inválido o expirado.',
  })
  @ApiResponse({
    status: 403,
    description: 'El usuario no tiene permisos suficientes.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'reviewer')
  @Get('admin/pending')
  findPendingReview() {
    return this.articlesService.findPendingReview();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Publicar artículo',
    description: 'Permite aprobar una propuesta y publicarla en el blog.',
  })
  @ApiParam({ name: 'id', description: 'ID del artículo.' })
  @ApiResponse({
    status: 200,
    description: 'Artículo publicado correctamente.',
    type: ArticleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Artículo no encontrado.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'reviewer')
  @Patch('admin/:id/publish')
  publishArticle(@Param('id') id: string) {
    return this.articlesService.publishArticle(id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Rechazar artículo',
    description: 'Permite rechazar una propuesta indicando el motivo.',
  })
  @ApiParam({ name: 'id', description: 'ID del artículo.' })
  @ApiResponse({
    status: 200,
    description: 'Artículo rechazado correctamente.',
    type: ArticleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para rechazar el artículo.',
  })
  @ApiResponse({
    status: 404,
    description: 'Artículo no encontrado.',
  })
  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'reviewer')
  @Patch('admin/:id/reject')
  rejectArticle(
    @Param('id') id: string,
    @Body() rejectArticleDto: RejectArticleDto,
  ) {
    return this.articlesService.rejectArticle(id, rejectArticleDto);
  }

  @ApiOperation({
    summary: 'Obtener artículo por slug',
    description: 'Devuelve el detalle público de un artículo publicado.',
  })
  @ApiParam({ name: 'slug', example: 'ansiedad-academica' })
  @ApiResponse({
    status: 200,
    description: 'Artículo encontrado.',
    type: ArticleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Artículo no encontrado o no publicado.',
  })
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.articlesService.findBySlug(slug);
  }
}
