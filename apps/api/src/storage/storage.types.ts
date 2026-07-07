export type UploadedStorageFile = {
  original_name: string;
  storage_path: string;
  public_url: string;
  mime_type: string;
  file_size: number;
};

export type UploadFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};
