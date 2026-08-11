export type ParticipationMessage = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  interest_area: string | null;
  message: string;
  is_read: boolean;
  is_starred: boolean;
  is_contacted: boolean;
  created_at: string;
  updated_at: string;
};
