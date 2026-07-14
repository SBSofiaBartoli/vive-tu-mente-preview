import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { FaqsController } from './faqs.controller';
import { FaqsService } from './faqs.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SupabaseModule, AuthModule],
  controllers: [FaqsController],
  providers: [FaqsService],
})
export class FaqsModule {}
