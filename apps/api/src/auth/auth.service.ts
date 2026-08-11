import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import type { AdminProfile, AuthenticatedAdmin } from './admin-auth.types';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async validateAdminToken(token: string): Promise<AuthenticatedAdmin> {
    const supabase = this.supabaseService.getAdminClient();

    const { data: userData, error: userError } =
      await supabase.auth.getUser(token);

    if (userError || !userData.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const { data: profile, error: profileError } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('user_id', userData.user.id)
      .eq('is_active', true)
      .returns<AdminProfile>()
      .maybeSingle();

    if (profileError) {
      throw new InternalServerErrorException(
        'Could not validate admin profile',
      );
    }

    if (!profile) {
      throw new ForbiddenException('User does not have admin access');
    }

    return {
      user: userData.user,
      profile,
    };
  }
}
