import { Controller, Get, Param } from '@nestjs/common';
import { ArticlesService } from './articles.service';

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

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.articlesService.findBySlug(slug);
  }
}
