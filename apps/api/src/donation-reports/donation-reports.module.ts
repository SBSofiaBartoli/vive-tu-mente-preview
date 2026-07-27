import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { DonationReportsController } from './donation-reports.controller';
import { DonationReportsService } from './donation-reports.service';

@Module({
  imports: [AuthModule, SupabaseModule],
  controllers: [DonationReportsController],
  providers: [DonationReportsService],
})
export class DonationReportsModule {}
