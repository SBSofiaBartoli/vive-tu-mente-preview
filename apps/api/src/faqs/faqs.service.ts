import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import type { CreateFaqDto } from './dto/create-faq.dto';
import type { UpdateFaqDto } from './dto/update-faq.dto';
import type { Faq } from './faq.types';

const ensureData = <T>(data: unknown): T => {
  if (!data) {
    throw new NotFoundException(
      'No se encontró la pregunta frecuente indicada.',
    );
  }

  return data as T;
};

@Injectable()
export class FaqsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findPublic(category?: string): Promise<Faq[]> {
    let query = this.supabaseService
      .getAdminClient()
      .from('faqs')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const response = await query;

    if (response.error) {
      throw new BadRequestException(response.error.message);
    }

    return ensureData<Faq[]>(response.data);
  }

  async findAllAdmin(): Promise<Faq[]> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('faqs')
      .select('*')
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (response.error) {
      throw new BadRequestException(response.error.message);
    }

    return ensureData<Faq[]>(response.data);
  }

  async create(createFaqDto: CreateFaqDto): Promise<Faq> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('faqs')
      .insert({
        ...createFaqDto,
        category: createFaqDto.category ?? 'general',
        sort_order: createFaqDto.sort_order ?? 0,
        is_active: createFaqDto.is_active ?? true,
      })
      .select()
      .single();

    if (response.error) {
      throw new BadRequestException(response.error.message);
    }

    return ensureData<Faq>(response.data);
  }

  async update(id: string, updateFaqDto: UpdateFaqDto): Promise<Faq> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('faqs')
      .update(updateFaqDto)
      .eq('id', id)
      .select()
      .single();

    if (response.error) {
      throw new NotFoundException(
        'No se encontró la pregunta frecuente indicada.',
      );
    }

    return ensureData<Faq>(response.data);
  }

  async remove(id: string): Promise<{ id: string }> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('faqs')
      .delete()
      .eq('id', id);

    if (response.error) {
      throw new NotFoundException(
        'No se encontró la pregunta frecuente indicada.',
      );
    }

    return { id };
  }
}
