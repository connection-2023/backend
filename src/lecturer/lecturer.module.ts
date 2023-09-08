import { Module } from '@nestjs/common';
import { LecturerController } from './controllers/lecturer.controller';
import { LecturerService } from './services/lecturer.service';

@Module({
  providers: [LecturerService],
  controllers: [LecturerController],
})
export class LecturerModule {}
