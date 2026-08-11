import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import type { TrackVisitDto } from './dto/track-visit.dto';
import type { VisitCounter } from './visit-counter.types';

const VISIT_WINDOW_HOURS = 2;

@Injectable()
export class VisitCounterService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async trackVisit(trackVisitDto: TrackVisitDto): Promise<VisitCounter> {
    const pagePath = trackVisitDto.page_path ?? '/';
    const windowStart = new Date(
      Date.now() - VISIT_WINDOW_HOURS * 60 * 60 * 1000,
    ).toISOString();

    const existingVisitResponse = await this.supabaseService
      .getAdminClient()
      .from('page_visits')
      .select('id')
      .eq('page_path', pagePath)
      .eq('visitor_key', trackVisitDto.visitor_key)
      .gte('visited_at', windowStart)
      .maybeSingle();

    if (existingVisitResponse.error) {
      throw new BadRequestException(existingVisitResponse.error.message);
    }

    if (!existingVisitResponse.data) {
      const insertResponse = await this.supabaseService
        .getAdminClient()
        .from('page_visits')
        .insert({
          page_path: pagePath,
          visitor_key: trackVisitDto.visitor_key,
        });

      if (insertResponse.error) {
        throw new BadRequestException(insertResponse.error.message);
      }
    }

    return this.getCounter(pagePath);
  }

  async getCounter(pagePath = '/'): Promise<VisitCounter> {
    const response = await this.supabaseService
      .getAdminClient()
      .from('page_visits')
      .select('id', { count: 'exact', head: true })
      .eq('page_path', pagePath);

    if (response.error) {
      throw new BadRequestException(response.error.message);
    }

    return {
      page_path: pagePath,
      total_visits: response.count ?? 0,
    };
  }
}
