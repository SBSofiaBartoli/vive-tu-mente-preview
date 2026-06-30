import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import type { CreateArticleProposalDto } from './dto/create-article-proposal.dto';

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

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.articlesService.findBySlug(slug);
  }
}
