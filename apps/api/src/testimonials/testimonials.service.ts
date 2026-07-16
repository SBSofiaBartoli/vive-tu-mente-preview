import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import type { CreateTestimonialDto } from './dto/create-testimonial.dto';
import type { RejectTestimonialDto } from './dto/reject-testimonial.dto';
import type { UpdateTestimonialFeaturedDto } from './dto/update-testimonial-featured.dto';
import type { Testimonial } from './testimonial.types';
import type { PaginatedResponse } from '../common/types/paginated-response.type';
import type { ListTestimonialsAdminQueryDto } from './dto/list-testimonials-admin-query.dto';

const ensureData = <T>(data: unknown): T => {
  if (!data) {
    throw new NotFoundException('No se encontró el testimonio indicado.');
  }

  return data as T;
};

@Injectable()
export class TestimonialsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findApproved(): Promise<Testimonial[]> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('testimonials')
      .select('*')
      .eq('status', 'approved')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (response.error) {
      throw new BadRequestException(response.error.message);
    }

    return ensureData<Testimonial[]>(response.data);
  }

  async findFeatured(): Promise<Testimonial[]> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('testimonials')
      .select('*')
      .eq('status', 'approved')
      .eq('is_featured', true)
      .order('created_at', { ascending: false });

    if (response.error) {
      throw new BadRequestException(response.error.message);
    }

    return ensureData<Testimonial[]>(response.data);
  }

  async create(
    createTestimonialDto: CreateTestimonialDto,
  ): Promise<Testimonial> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('testimonials')
      .insert({
        ...createTestimonialDto,
        status: 'pending',
      })
      .select()
      .single();

    if (response.error) {
      throw new BadRequestException(response.error.message);
    }

    return ensureData<Testimonial>(response.data);
  }

  async findAllAdmin(
    filters: ListTestimonialsAdminQueryDto,
  ): Promise<PaginatedResponse<Testimonial>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabaseService
      .getAdminClient()
      .from('testimonials')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.role) {
      query = query.eq('role', filters.role);
    }

    if (filters.is_featured === 'true') {
      query = query.eq('is_featured', true);
    }

    if (filters.is_featured === 'false') {
      query = query.eq('is_featured', false);
    }

    if (filters.search) {
      query = query.or(
        `full_name.ilike.%${filters.search}%,workshop_name.ilike.%${filters.search}%,comment.ilike.%${filters.search}%`,
      );
    }

    const response = await query;

    if (response.error) {
      throw new BadRequestException(response.error.message);
    }

    const total = response.count ?? 0;

    return {
      items: ensureData<Testimonial[]>(response.data),
      meta: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findPending(): Promise<Testimonial[]> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('testimonials')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (response.error) {
      throw new BadRequestException(response.error.message);
    }

    return ensureData<Testimonial[]>(response.data);
  }

  async approve(id: string): Promise<Testimonial> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('testimonials')
      .update({
        status: 'approved',
        rejection_reason: null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (response.error) {
      throw new NotFoundException('No se encontró el testimonio indicado.');
    }

    return ensureData<Testimonial>(response.data);
  }

  async reject(
    id: string,
    rejectTestimonialDto: RejectTestimonialDto,
  ): Promise<Testimonial> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('testimonials')
      .update({
        status: 'rejected',
        rejection_reason: rejectTestimonialDto.rejection_reason,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (response.error) {
      throw new NotFoundException('No se encontró el testimonio indicado.');
    }

    return ensureData<Testimonial>(response.data);
  }

  async updateFeatured(
    id: string,
    updateTestimonialFeaturedDto: UpdateTestimonialFeaturedDto,
  ): Promise<Testimonial> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('testimonials')
      .update({
        is_featured: updateTestimonialFeaturedDto.is_featured,
      })
      .eq('id', id)
      .select()
      .single();

    if (response.error) {
      throw new NotFoundException('No se encontró el testimonio indicado.');
    }

    return ensureData<Testimonial>(response.data);
  }

  async remove(id: string): Promise<{ id: string }> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (response.error) {
      throw new NotFoundException('No se encontró el testimonio indicado.');
    }

    return { id };
  }
}
