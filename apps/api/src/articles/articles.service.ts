import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Article } from './article.types';
import type { CreateArticleProposalDto } from './dto/create-article-proposal.dto';
import type { RejectArticleDto } from './dto/reject-article.dto';
import type { RequestArticleChangesDto } from './dto/request-article-changes.dto';
import type { PaginatedResponse } from '../common/types/paginated-response.type';
import type { ListArticlesAdminQueryDto } from './dto/list-articles-admin-query.dto';
import type { CreateAdminArticleDto } from './dto/create-admin-article.dto';

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

    const slug = this.createProposalSlug(createArticleProposalDto.title);

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
        cover_image_url: createArticleProposalDto.cover_image_url ?? null,
        cover_image_alt: createArticleProposalDto.cover_image_alt ?? null,
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

  async createAdminArticle(
    createAdminArticleDto: CreateAdminArticleDto,
  ): Promise<Article> {
    const supabase = this.supabaseService.getAdminClient();

    const slug = this.createProposalSlug(createAdminArticleDto.title);
    const isPublished = createAdminArticleDto.status === 'published';

    const { data, error } = await supabase
      .from('articles')
      .insert({
        title: createAdminArticleDto.title,
        slug,
        excerpt: createAdminArticleDto.excerpt ?? null,
        content: createAdminArticleDto.content,
        cover_image_url: createAdminArticleDto.cover_image_url ?? null,
        cover_image_alt: createAdminArticleDto.cover_image_alt ?? null,
        author_name: createAdminArticleDto.author_name ?? null,
        category: createAdminArticleDto.category ?? null,
        submitted_by_name: null,
        submitted_by_email: null,
        status: createAdminArticleDto.status,
        is_featured: createAdminArticleDto.is_featured ?? false,
        published_at: isPublished ? new Date().toISOString() : null,
        rejection_reason: null,
        review_notes: null,
      })
      .select('*')
      .returns<Article>()
      .single();

    if (error) {
      throw new InternalServerErrorException('Could not create admin article');
    }

    return data;
  }

  async findAllAdmin(
    filters: ListArticlesAdminQueryDto,
  ): Promise<PaginatedResponse<Article>> {
    const supabase = this.supabaseService.getAdminClient();

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('articles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%,content.ilike.%${filters.search}%`,
      );
    }

    const { data, error, count } = await query.returns<Article[]>();

    if (error) {
      throw new InternalServerErrorException('Could not get admin articles');
    }

    return {
      items: data,
      meta: {
        page,
        limit,
        total: count ?? 0,
        total_pages: Math.ceil((count ?? 0) / limit),
      },
    };
  }

  async findPendingReview(): Promise<Article[]> {
    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'pending_review')
      .order('created_at', { ascending: false })
      .returns<Article[]>();

    if (error) {
      throw new InternalServerErrorException('Could not get pending articles');
    }

    return data;
  }

  async publishArticle(id: string): Promise<Article> {
    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase
      .from('articles')
      .update({
        status: 'published',
        rejection_reason: null,
        review_notes: null,
        published_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .returns<Article>()
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException('Could not publish article');
    }

    if (!data) {
      throw new NotFoundException('Article not found');
    }

    return data;
  }

  async rejectArticle(
    id: string,
    rejectArticleDto: RejectArticleDto,
  ): Promise<Article> {
    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase
      .from('articles')
      .update({
        status: 'rejected',
        rejection_reason: rejectArticleDto.rejection_reason,
      })
      .eq('id', id)
      .select('*')
      .returns<Article>()
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException('Could not reject article');
    }

    if (!data) {
      throw new NotFoundException('Article not found');
    }

    return data;
  }

  async requestChanges(
    id: string,
    requestArticleChangesDto: RequestArticleChangesDto,
  ): Promise<Article> {
    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase
      .from('articles')
      .update({
        status: 'changes_requested',
        review_notes: requestArticleChangesDto.review_notes,
        rejection_reason: null,
      })
      .eq('id', id)
      .select('*')
      .returns<Article>()
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        'Could not request article changes',
      );
    }

    if (!data) {
      throw new NotFoundException('Article not found');
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

  private createProposalSlug(title: string): string {
    const uniqueSuffix = Date.now().toString(36);

    return `${this.createSlug(title)}-${uniqueSuffix}`;
  }
}
