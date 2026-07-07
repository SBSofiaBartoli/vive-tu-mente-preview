import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { MediaFilesController } from './media-files.controller';
import { MediaFilesService } from './media-files.service';

@Module({
  imports: [SupabaseModule],
  controllers: [MediaFilesController],
  providers: [MediaFilesService],
})
export class MediaFilesModule {}
