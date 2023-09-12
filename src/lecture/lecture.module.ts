import { Module } from '@nestjs/common';
import { LectureController } from '../lecture/controllers/lecture.controller';
import { LectureService } from '../lecture/services/lecture.service';
import { QueryFilter } from 'src/common/query.filter';
import { LectureLikeService } from './services/lecture-like.service';
import { LectureLikeController } from './controllers/lecture-like.controller';

@Module({
  controllers: [LectureController, LectureLikeController],
  providers: [LectureService, QueryFilter, LectureLikeService],
})
export class LectureModule {}
