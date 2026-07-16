export type MediaFileStatus =
  | "pending"
  | "changes_requested"
  | "approved"
  | "rejected"
  | "archived";

export type MediaFile = {
  id: string;
  original_name: string;
  storage_path: string;
  public_url: string | null;
  mime_type: string;
  file_size: number;
  section: string;
  status: MediaFileStatus;
  uploaded_by_name: string | null;
  uploaded_by_email: string | null;
  review_notes: string | null;
  rejection_reason: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type UpdateMediaFileStatusPayload = {
  status: MediaFileStatus;
  review_notes?: string | null;
  rejection_reason?: string | null;
};

export type UploadedStorageFile = {
  original_name: string;
  storage_path: string;
  public_url: string | null;
  mime_type: string;
  file_size: number;
};

export type CreateMediaFilePayload = UploadedStorageFile & {
  section: string;
  uploaded_by_name?: string | null;
  uploaded_by_email?: string | null;
};
