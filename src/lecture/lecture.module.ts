import { Module } from '@nestjs/common';
import { LectureController } from '../lecture/controllers/lecture.controller';
import { LectureService } from '../lecture/services/lecture.service';
import { QueryFilter } from 'src/common/query.filter';

@Module({
  controllers: [LectureController],
  providers: [LectureService, QueryFilter],
})
export class LectureModule {}
