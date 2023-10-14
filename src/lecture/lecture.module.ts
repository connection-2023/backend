import { Module } from '@nestjs/common';
import { LectureController } from '@src/lecture/controllers/lecture.controller';
import { LectureService } from '@src/lecture/services/lecture.service';
import { QueryFilter } from '@src/common/filters/query.filter';
import { LectureLikeService } from '@src/lecture/services/lecture-like.service';
import { LectureLikeController } from '@src/lecture/controllers/lecture-like.controller';
import { UploadsModule } from '@src/uploads/uploads.module';
import { LectureRepository } from './repositories/lecture.repository';

@Module({
  imports: [UploadsModule],
  controllers: [LectureController, LectureLikeController],
  providers: [
    LectureService,
    QueryFilter,
    LectureLikeService,
    LectureRepository,
  ],
})
export class LectureModule {}
