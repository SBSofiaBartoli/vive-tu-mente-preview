export type PageVisit = {
  id: string;
  page_path: string;
  visitor_key: string;
  visited_at: string;
};

export type VisitCounter = {
  page_path: string;
  total_visits: number;
};
