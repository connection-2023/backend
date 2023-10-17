import { Module } from '@nestjs/common';
import { UploadsService } from '@src/uploads/uploads.service';
import { UploadsController } from './uploads.controller';

@Module({
  providers: [UploadsService],
  exports: [UploadsService],
  controllers: [UploadsController],
})
export class UploadsModule {}
