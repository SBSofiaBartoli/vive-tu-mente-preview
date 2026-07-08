import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import type { UpsertSiteContentDto } from './dto/upsert-site-content.dto';

type SiteContent = {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

@Injectable()
export class ContentService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getBySectionKey(sectionKey: string): Promise<SiteContent> {
    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase
      .from('site_contents')
      .select('*')
      .eq('section_key', sectionKey)
      .returns<SiteContent>()
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        'Could not get site content section',
      );
    }

    if (!data) {
      throw new NotFoundException('Content section not found');
    }

    return data;
  }

  async findAllAdmin(): Promise<SiteContent[]> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('site_contents')
      .select('*')
      .returns<SiteContent[]>()
      .order('section_key', { ascending: true });

    if (response.error) {
      throw new NotFoundException('No se pudo obtener el contenido del sitio.');
    }

    return response.data;
  }

  async upsert(
    upsertSiteContentDto: UpsertSiteContentDto,
  ): Promise<SiteContent> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('site_contents')
      .upsert(
        {
          ...upsertSiteContentDto,
          title: upsertSiteContentDto.title ?? null,
          subtitle: upsertSiteContentDto.subtitle ?? null,
          body: upsertSiteContentDto.body ?? null,
          metadata: upsertSiteContentDto.metadata ?? null,
          is_active: upsertSiteContentDto.is_active ?? true,
        },
        {
          onConflict: 'section_key',
        },
      )
      .select()
      .returns<SiteContent>()
      .single();

    if (response.error) {
      throw new NotFoundException('No se pudo guardar el contenido del sitio.');
    }

    return response.data;
  }
}
