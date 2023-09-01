import { Module } from '@nestjs/common';
import { LectureController } from '../lecture/controllers/lecture.controller';
import { LectureService } from '../lecture/services/lecture.service';

@Module({
  controllers: [LectureController],
  providers: [LectureService],
})
export class LectureModule {}
