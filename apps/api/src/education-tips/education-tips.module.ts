import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { EducationTipsController } from './education-tips.controller';
import { EducationTipsService } from './education-tips.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SupabaseModule, AuthModule],
  controllers: [EducationTipsController],
  providers: [EducationTipsService],
})
export class EducationTipsModule {}
