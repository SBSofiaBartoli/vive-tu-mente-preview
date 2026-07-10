import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { ContentModule } from './content/content.module';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { ParticipationMessagesModule } from './participation-messages/participation-messages.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { FaqsModule } from './faqs/faqs.module';
import { EducationTipsModule } from './education-tips/education-tips.module';
import { VisitCounterModule } from './visit-counter/visit-counter.module';
import { MediaFilesModule } from './media-files/media-files.module';
import { StorageModule } from './storage/storage.module';
import { EducationCardsModule } from './education-cards/education-cards.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    ContentModule,
    ArticlesModule,
    AuthModule,
    ParticipationMessagesModule,
    TestimonialsModule,
    FaqsModule,
    EducationTipsModule,
    VisitCounterModule,
    MediaFilesModule,
    StorageModule,
    EducationCardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
