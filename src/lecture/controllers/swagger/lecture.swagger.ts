import { ApiOperator } from '@src/common/types/type';
import { LectureController } from '../lecture.controller';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiOperationOptions,
} from '@nestjs/swagger';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { GeneralResponseDto } from '@src/common/swagger/dtos/general-response.dto';
import { CombinedScheduleDto } from '../../dtos/combined-schedule.dto';
import { EnrolledLectureScheduleDto } from '@src/lecture/dtos/last-regist-schedule.dto';
import { LectureLearnerInfoDto } from '@src/lecture/dtos/lecture-learner-info.dto';
import { LectureReviewController } from '../lecture-review.controller';
import { CombinedMyReviewWithCountDto } from '@src/lecture/dtos/combined-my-review-with-count.dto';
import { LectureReviewRatingsDto } from '@src/lecture/dtos/lecture-review-ratings.dto';
import { LectureReviewDto } from '@src/common/dtos/lecture-review.dto';
import { LectureLikeController } from '../lecture-like.controller';
import { PaginationResponseDto } from '@src/common/swagger/dtos/pagination-response.dto';
import { LectureDto } from '@src/common/dtos/lecture.dto';

export const ApiLecture: ApiOperator<keyof LectureController> = {
  GetLectureSchedule: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      GeneralResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'lectureSchedule',
        CombinedScheduleDto,
      ),
    );
  },
  CreateLecture: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  ReadLecturePreview: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  ReadLectureDetail: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  ReadManyLecture: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  DeleteLecture: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  UpdateLecture: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },

  ReadLectureReservation: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  GetLectureLearnerList: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  ReadManyEnrollLectureWithUserId: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  GetEnrollLectureList: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  ReadManyLectureSchedules: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  ReadManyLectureDailySchedules: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  GetEnrollScheduleDetail: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },

  GetLastRegistSchedule: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'lastRegistSchedule',
        EnrolledLectureScheduleDto,
      ),
    );
  },

  GetLectureScheduleLearnersInfo: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'scheduleLearnerList',
        LectureLearnerInfoDto,
        { isArray: true },
      ),
    );
  },
};

export const ApiLectureReview: ApiOperator<keyof LectureReviewController> = {
  GetMyReviewWithUserId: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      GeneralResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'userMyReview',
        CombinedMyReviewWithCountDto,
      ),
    );
  },
  CreateLectureReview: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  UpdateLectureReview: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  ReadManyLectureReviewWithUserId: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  DeleteLectureReview: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'deletedLectureReview',
        LectureReviewDto,
      ),
    );
  },
  ReadManyReservationThatCanBeCreated: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  GetMyReviewWithLecturerId: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      GeneralResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'lecturerMyReview',
        CombinedMyReviewWithCountDto,
      ),
    );
  },
  ReadManyLecturerReviewWithUserId: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  GetReviewRatingsAndCounts: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'reviewRatings',
        LectureReviewRatingsDto,
        { isArray: true },
      ),
    );
  },
};
export const ApiLikedLecture: ApiOperator<keyof LectureLikeController> = {
  GetLikedLecture: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'likedLectures',
        LectureDto,
      ),
    );
  },
  CreateLectureLike: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
  DeleteLectureLike: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    throw new Error('Function not implemented.');
  },
};
