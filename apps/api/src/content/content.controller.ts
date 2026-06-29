import { Controller, Get, Param } from '@nestjs/common';
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get(':sectionKey')
  getBySectionKey(@Param('sectionKey') sectionKey: string) {
    return this.contentService.getBySectionKey(sectionKey);
  }
}
