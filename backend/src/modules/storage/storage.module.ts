import { Module } from "@nestjs/common";
import { LocalStorageService } from "./local.storage.service";
import { S3StorageService } from "./s3.storage.service";

@Module({
  providers: [LocalStorageService, S3StorageService],
  exports: [LocalStorageService, S3StorageService],
})
export class StorageModule {}
