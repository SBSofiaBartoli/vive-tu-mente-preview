import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { EducationCardsController } from './education-cards.controller';
import { EducationCardsService } from './education-cards.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SupabaseModule, AuthModule],
  controllers: [EducationCardsController],
  providers: [EducationCardsService],
})
export class EducationCardsModule {}
