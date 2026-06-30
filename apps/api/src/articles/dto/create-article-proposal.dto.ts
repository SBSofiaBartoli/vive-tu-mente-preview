export type CreateArticleProposalDto = {
  title: string;
  excerpt?: string;
  content: string;
  author_name?: string;
  category?: string;
  submitted_by_name: string;
  submitted_by_email: string;
};
