import fs from "fs/promises";
import path from "path";
import { IStorageService, StorageUploadResult } from "../../interfaces";

export class LocalStorageService implements IStorageService {
  private basePath = path.join(process.cwd(), "uploads");

  /**
   *
   * @param file - File buffer
   * @param filePath - File path
   * @param mimeType - File MIME type
   * @returns Promise that resolves to an object containing the file path.
   */
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
    };
  }

  /**
   * @param key - Filename
   * @returns Promise that resolves when the file is deleted
   */
  async delete(key: string): Promise<void> {
    const fullPath = path.join(this.basePath, key);
    await fs.unlink(fullPath);
  }

  /**
   * Returns the public URL of a file in the local storage
   * @param key - Filename
   * @returns Public URL for the file
   **/
  getPublicUrl(key: string): string {
    return `${process.env.APP_URL}/uploads/${key}`;
  }
}
