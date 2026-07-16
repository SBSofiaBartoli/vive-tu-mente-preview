export type EducationCard = {
  id: string;
  segment_key: string;
  title: string;
  description: string;
  icon_name: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateEducationCardPayload = {
  segment_key: string;
  title: string;
  description: string;
  icon_name: string;
  sort_order: number;
  is_active: boolean;
};

export type UpdateEducationCardPayload = Partial<CreateEducationCardPayload>;

export type EducationTip = {
  id: string;
  segment_key: string;
  title: string;
  content: string;
  resource_url: string | null;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateEducationTipPayload = {
  segment_key: string;
  title: string;
  content: string;
  resource_url: string | null;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
};

export type UpdateEducationTipPayload = Partial<CreateEducationTipPayload>;

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type PaginatedEducationCardsResponse = {
  items: EducationCard[];
  meta: PaginationMeta;
};

export type PaginatedEducationTipsResponse = {
  items: EducationTip[];
  meta: PaginationMeta;
};
