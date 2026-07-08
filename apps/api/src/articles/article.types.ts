export type ArticleStatus =
  | 'draft'
  | 'pending_review'
  | 'changes_requested'
  | 'published'
  | 'rejected'
  | 'archived';

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  author_name: string | null;
  category: string | null;
  status: ArticleStatus;
  is_featured: boolean;
  submitted_by_name: string | null;
  submitted_by_email: string | null;
  rejection_reason: string | null;
  review_notes: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};
