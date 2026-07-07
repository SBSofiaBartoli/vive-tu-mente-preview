import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { FaqsController } from './faqs.controller';
import { FaqsService } from './faqs.service';

@Module({
  imports: [SupabaseModule],
  controllers: [FaqsController],
  providers: [FaqsService],
})
export class FaqsModule {}
