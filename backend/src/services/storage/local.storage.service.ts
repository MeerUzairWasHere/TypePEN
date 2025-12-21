import fs from "fs/promises";
import path from "path";
import { IStorageService, StorageUploadResult } from "../../interfaces";

export class LocalStorageService implements IStorageService {
  private basePath = path.join(process.cwd(), "uploads");

  async upload(
    file: Buffer,
    filePath: string,
    mimeType: string
  ): Promise<StorageUploadResult> {
    const fullPath = path.join(this.basePath, filePath);

    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, file);

    return {
      key: filePath,
      url: this.getPublicUrl(filePath),
    };
  }

  async delete(key: string): Promise<void> {
    const fullPath = path.join(this.basePath, key);
    await fs.unlink(fullPath);
  }

  getPublicUrl(key: string): string {
    return `${process.env.APP_URL}/uploads/${key}`;
  }

  async getSignedUrl(key: string): Promise<string> {
    return this.getPublicUrl(key);
  }
}
