import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SupabaseModule, AuthModule],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
