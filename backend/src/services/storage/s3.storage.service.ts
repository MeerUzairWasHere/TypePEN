import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { IStorageService, StorageUploadResult } from "../../interfaces";

export class S3StorageService implements IStorageService {
  private s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  private bucket = process.env.AWS_S3_BUCKET!;

  /**
   * Uploads a file to S3
   *
   * @param file - File buffer
   * @param key - S3 object key
   * @param mimeType - File MIME type
   * @returns Promise that resolves to an object containing the S3 object key.
   */
  async upload(
    file: Buffer,
    key: string,
    mimeType: string
  ): Promise<StorageUploadResult> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: mimeType,
      })
    );

    return {
      key,
    };
  }

  /**
   * Deletes an object from S3
   *
   * @param key - S3 object key
   * @returns Promise that resolves when the object is deleted
   */
  async delete(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    );
  }

  /**
   * Returns the public URL of an object in S3
   *
   * @param key - S3 object key
   * @returns Public S3 URL for the object
   */
  getPublicUrl(key: string): string {
    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }

  /**
   * Generates a temporary signed URL to access a private S3 object.
   *
   * @param key - S3 object key
   * @param options.expiresInSeconds - URL expiry time in seconds (optional) - default is 5 minutes
   * @returns Signed URL valid for a limited time
   */
  async getSignedUrl(
    key: string,
    options?: { expiresInSeconds?: number }
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3, command, {
      expiresIn: options?.expiresInSeconds ?? 60 * 5, // 5 minutes
    });
  }
}
