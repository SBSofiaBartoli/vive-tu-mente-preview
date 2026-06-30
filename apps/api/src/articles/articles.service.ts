import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Article } from './article.types';

@Injectable()
export class ArticlesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findPublished(): Promise<Article[]> {
    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .returns<Article[]>();

    if (error) {
      throw new InternalServerErrorException('Could not get articles');
    }

    return data;
  }

  async findFeatured(): Promise<Article[]> {
    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('published_at', { ascending: false })
      .returns<Article[]>();

    if (error) {
      throw new InternalServerErrorException('Could not get featured articles');
    }

    return data;
  }

  async findBySlug(slug: string): Promise<Article> {
    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .returns<Article>()
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException('Could not get article');
    }

    if (!data) {
      throw new NotFoundException('Article not found');
    }

    return data;
  }
}
