import { Module } from '@nestjs/common';
import { UploadsService } from '@src/uploads/services/uploads.service';
import { UploadsController } from '@src/uploads/controllers/uploads.controller';

@Module({
  providers: [UploadsService],
  exports: [UploadsService],
  controllers: [UploadsController],
})
export class UploadsModule {}
