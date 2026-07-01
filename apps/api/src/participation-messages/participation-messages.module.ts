import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthModule } from '../auth/auth.module';
import { ParticipationMessagesController } from './participation-messages.controller';
import { ParticipationMessagesService } from './participation-messages.service';

@Module({
  imports: [SupabaseModule, AuthModule],
  controllers: [ParticipationMessagesController],
  providers: [ParticipationMessagesService],
})
export class ParticipationMessagesModule {}
