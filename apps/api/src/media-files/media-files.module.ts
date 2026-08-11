import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { MediaFilesController } from './media-files.controller';
import { MediaFilesService } from './media-files.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SupabaseModule, AuthModule],
  controllers: [MediaFilesController],
  providers: [MediaFilesService],
})
export class MediaFilesModule {}
