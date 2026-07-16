export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  meta: PaginationMeta;
};
