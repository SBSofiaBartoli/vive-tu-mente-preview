import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Article } from './article.types';
import type { CreateArticleProposalDto } from './dto/create-article-proposal.dto';

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

  async createProposal(
    createArticleProposalDto: CreateArticleProposalDto,
  ): Promise<Article> {
    const supabase = this.supabaseService.getAdminClient();

    const slug = this.createSlug(createArticleProposalDto.title);

    const { data, error } = await supabase
      .from('articles')
      .insert({
        title: createArticleProposalDto.title,
        slug,
        excerpt: createArticleProposalDto.excerpt ?? null,
        content: createArticleProposalDto.content,
        author_name: createArticleProposalDto.author_name ?? null,
        category: createArticleProposalDto.category ?? null,
        submitted_by_name: createArticleProposalDto.submitted_by_name,
        submitted_by_email: createArticleProposalDto.submitted_by_email,
        status: 'pending_review',
        is_featured: false,
      })
      .select('*')
      .returns<Article>()
      .single();

    if (error) {
      throw new InternalServerErrorException(
        'Could not create article proposal',
      );
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

  private createSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
