import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { EducationTipsController } from './education-tips.controller';
import { EducationTipsService } from './education-tips.service';

@Module({
  imports: [SupabaseModule],
  controllers: [EducationTipsController],
  providers: [EducationTipsService],
})
export class EducationTipsModule {}
