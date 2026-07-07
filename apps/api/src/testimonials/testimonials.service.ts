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
