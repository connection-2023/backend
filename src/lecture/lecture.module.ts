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
import { LectureTemporarilySaveRepository } from './repositories/temporary-lecture.repository';
import { LecturerModule } from '@src/lecturer/lecturer.module';
import { LecturerRepository } from '@src/lecturer/repositories/lecturer.repository';
import { LectureReviewService } from './services/lecture-review.service';
import { LectureReviewRepository } from './repositories/lecture-review.repository';
import { LectureReviewController } from './controllers/lecture-review.controller';
import { CouponRepository } from '@src/coupon/repository/coupon.repository';
import { LectureLikeRepository } from './repositories/lecture-like.repository';
import { LectureReviewLikeService } from './services/lecture-review-like.service';
import { LectureReviewLikeRepository } from './repositories/lecture-review-like.repository';
import { LectureReviewLikeController } from './controllers/lecture-review-like.controller';
import { PopularLectureController } from './controllers/popular-lecture.controller';
import { PopularLectureRepository } from './repositories/popular-lecture.repository';
import { PopularLectureService } from './services/popular-lecture.service';
import { LatestLectureController } from './controllers/latest-lecture.controller';
import { LatestLectureService } from './services/latest-lecture.service';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [
    LectureController,
    LectureLikeController,
    LectureTemporarilySaveController,
    LectureReviewController,
    LectureReviewLikeController,
    PopularLectureController,
    LatestLectureController,
  ],
  providers: [
    LectureService,
    QueryFilter,
    LectureLikeService,
    LectureRepository,
    LectureTemporarilySaveService,
    LectureTemporarilySaveRepository,
    LecturerRepository,
    LectureReviewService,
    LectureReviewRepository,
    CouponRepository,
    LectureLikeRepository,
    LectureReviewLikeService,
    LectureReviewLikeRepository,
    PopularLectureService,
    PopularLectureRepository,
    LatestLectureService,
  ],
})
export class LectureModule {}
