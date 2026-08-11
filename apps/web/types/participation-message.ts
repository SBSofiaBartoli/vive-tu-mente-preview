export type ParticipationMessage = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  interest_area: string;
  message: string;
  is_read: boolean;
  is_starred: boolean;
  is_contacted: boolean;
  created_at: string;
  updated_at: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type PaginatedParticipationMessagesResponse = {
  items: ParticipationMessage[];
  meta: PaginationMeta;
};
