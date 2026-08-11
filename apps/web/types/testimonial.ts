export type TestimonialRole =
  | "participant"
  | "professional"
  | "alliance"
  | "company"
  | "institution"
  | "organization";

export type TestimonialStatus = "pending" | "approved" | "rejected";

export type Testimonial = {
  id: string;
  full_name: string;
  role: TestimonialRole;
  workshop_name: string | null;
  comment: string;
  status: TestimonialStatus;
  is_featured: boolean;
  rejection_reason: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type PaginatedTestimonialsResponse = {
  items: Testimonial[];
  meta: PaginationMeta;
};
