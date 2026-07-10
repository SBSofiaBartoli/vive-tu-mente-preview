import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { EducationCardsController } from './education-cards.controller';
import { EducationCardsService } from './education-cards.service';

@Module({
  imports: [SupabaseModule],
  controllers: [EducationCardsController],
  providers: [EducationCardsService],
})
export class EducationCardsModule {}
