export interface StorageUploadResult {
  url: string;
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

  getSignedUrl(key: string, options?: SignedUrlOptions): Promise<string>;
}
