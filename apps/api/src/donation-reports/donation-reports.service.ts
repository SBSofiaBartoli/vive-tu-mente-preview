import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import type { PaginatedResponse } from '../common/types/paginated-response.type';
import { SupabaseService } from '../supabase/supabase.service';
import type { CreateDonationReportDto } from './dto/create-donation-report.dto';
import type { ListDonationReportsAdminQueryDto } from './dto/list-donation-reports-admin-query.dto';
import type { UpdateDonationReportStatusDto } from './dto/update-donation-report-status.dto';
import type { DonationReport } from './donation-report.types';

@Injectable()
export class DonationReportsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(
    createDonationReportDto: CreateDonationReportDto,
  ): Promise<DonationReport> {
    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase
      .from('donation_reports')
      .insert({
        donor_name: createDonationReportDto.donor_name,
        donor_email: createDonationReportDto.donor_email,
        amount: createDonationReportDto.amount,
        receipt_media_file_id:
          createDonationReportDto.receipt_media_file_id ?? null,
      })
      .select('*')
      .returns<DonationReport>()
      .single();

    if (error) {
      throw new InternalServerErrorException(
        'Could not create donation report',
      );
    }

    return data;
  }

  async findAllForAdmin(
    filters: ListDonationReportsAdminQueryDto,
  ): Promise<PaginatedResponse<DonationReport>> {
    const supabase = this.supabaseService.getAdminClient();

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('donation_reports')
      .select('*, receipt_media_file:media_files(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.search) {
      query = query.or(
        `donor_name.ilike.%${filters.search}%,donor_email.ilike.%${filters.search}%`,
      );
    }

    const { data, error, count } = await query.returns<DonationReport[]>();

    if (error) {
      throw new InternalServerErrorException('Could not get donation reports');
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

  async updateStatus(
    id: string,
    updateStatusDto: UpdateDonationReportStatusDto,
  ): Promise<DonationReport> {
    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase
      .from('donation_reports')
      .update({
        status: updateStatusDto.status,
        review_notes: updateStatusDto.review_notes ?? null,
        rejection_reason: updateStatusDto.rejection_reason ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .returns<DonationReport>()
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        'Could not update donation report',
      );
    }

    if (!data) {
      throw new NotFoundException('Donation report not found');
    }

    return data;
  }
}
