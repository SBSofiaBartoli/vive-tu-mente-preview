export type DonationReportStatus =
  | 'pending'
  | 'confirmed'
  | 'rejected'
  | 'archived';

export type DonationReport = {
  id: string;
  donor_name: string;
  donor_email: string;
  amount: number;
  receipt_media_file_id: string | null;
  status: DonationReportStatus;
  review_notes: string | null;
  rejection_reason: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};
