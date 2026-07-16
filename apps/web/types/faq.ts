export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateFaqPayload = {
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_active: boolean;
};

export type UpdateFaqPayload = Partial<CreateFaqPayload>;

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type PaginatedFaqsResponse = {
  items: Faq[];
  meta: PaginationMeta;
};
