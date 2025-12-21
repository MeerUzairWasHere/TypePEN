export interface StorageUploadResult {
  key: string;
}

export interface SignedUrlOptions {
  expiresInSeconds?: number;
}

export interface IStorageService {
  upload(
    file: Buffer,
    path: string,
    mimeType: string
  ): Promise<StorageUploadResult>;

  delete(key: string): Promise<void>;

  getPublicUrl(key: string): string;
}
