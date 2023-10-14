import { Module } from '@nestjs/common';
import { UploadsService } from '@src/uploads/uploads.service';

@Module({
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}
