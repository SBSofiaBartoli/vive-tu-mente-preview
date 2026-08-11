import type { User } from '@supabase/supabase-js';

export type AdminRole = 'admin' | 'editor' | 'reviewer';

export type AdminProfile = {
  id: string;
  user_id: string;
  role: AdminRole;
  is_active: boolean;
  display_name: string | null;
  created_at: string;
  updated_at: string;
};

export type AuthenticatedAdmin = {
  user: User;
  profile: AdminProfile;
};
