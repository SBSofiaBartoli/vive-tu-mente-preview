import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { VisitCounterController } from './visit-counter.controller';
import { VisitCounterService } from './visit-counter.service';

@Module({
  imports: [SupabaseModule],
  controllers: [VisitCounterController],
  providers: [VisitCounterService],
})
export class VisitCounterModule {}
