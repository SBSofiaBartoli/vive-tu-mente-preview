import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { ContentModule } from './content/content.module';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { ParticipationMessagesModule } from './participation-messages/participation-messages.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
