import { IStorageService } from "../../interfaces";
import { LocalStorageService } from "./local.storage.service";
import { S3StorageService } from "./s3.storage.service";

export function createStorageService(): IStorageService {
  switch (process.env.STORAGE_DRIVER) {
    case "s3":
      return new S3StorageService();

    case "local":
    default:
      return new LocalStorageService();
  }
}
