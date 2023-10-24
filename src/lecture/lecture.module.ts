import { Module } from '@nestjs/common';
import { LectureController } from '@src/lecture/controllers/lecture.controller';
import { LectureService } from '@src/lecture/services/lecture.service';
import { QueryFilter } from '@src/common/filters/query.filter';
import { LectureLikeService } from '@src/lecture/services/lecture-like.service';
import { LectureLikeController } from '@src/lecture/controllers/lecture-like.controller';
import { UploadsModule } from '@src/uploads/uploads.module';
import { LectureRepository } from './repositories/lecture.repository';
import { LectureTemporarilySaveController } from './controllers/lecture-temporarily-save.controller';
import { LectureTemporarilySaveService } from './services/lecture-temporarily-save.service';

@Module({
  imports: [UploadsModule],
  controllers: [
    LectureController,
    LectureLikeController,
    LectureTemporarilySaveController,
  ],
  providers: [
    LectureService,
    QueryFilter,
    LectureLikeService,
    LectureRepository,
    LectureTemporarilySaveService,
  ],
})
export class LectureModule {}
