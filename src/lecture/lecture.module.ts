import { Module } from '@nestjs/common';
import { LectureController } from '@src/lecture/controllers/lecture.controller';
import { LectureService } from '@src/lecture/services/lecture.service';
import { QueryFilter } from '@src/common/query.filter';
import { LectureLikeService } from '@src/lecture/services/lecture-like.service';
import { LectureLikeController } from '@src/lecture/controllers/lecture-like.controller';

@Module({
  controllers: [LectureController, LectureLikeController],
  providers: [LectureService, QueryFilter, LectureLikeService],
})
export class LectureModule {}
