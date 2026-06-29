import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

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
}
