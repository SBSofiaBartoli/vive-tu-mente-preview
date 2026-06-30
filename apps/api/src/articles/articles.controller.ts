import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import type { CreateArticleProposalDto } from './dto/create-article-proposal.dto';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { AdminRolesGuard } from '../auth/admin-roles.guard';
import { Roles } from '../auth/roles.decorator';
import type { RejectArticleDto } from './dto/reject-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  findPublished() {
    return this.articlesService.findPublished();
  }

  @Get('featured')
  findFeatured() {
    return this.articlesService.findFeatured();
  }

  @Post('proposals')
  createProposal(@Body() createArticleProposalDto: CreateArticleProposalDto) {
    return this.articlesService.createProposal(createArticleProposalDto);
  }

  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'reviewer')
  @Get('admin/pending')
  findPendingReview() {
    return this.articlesService.findPendingReview();
  }

  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'reviewer')
  @Patch('admin/:id/publish')
  publishArticle(@Param('id') id: string) {
    return this.articlesService.publishArticle(id);
  }

  @UseGuards(AdminAuthGuard, AdminRolesGuard)
  @Roles('admin', 'reviewer')
  @Patch('admin/:id/reject')
  rejectArticle(
    @Param('id') id: string,
    @Body() rejectArticleDto: RejectArticleDto,
  ) {
    return this.articlesService.rejectArticle(id, rejectArticleDto);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.articlesService.findBySlug(slug);
  }
}
