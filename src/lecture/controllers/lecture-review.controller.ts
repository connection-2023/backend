import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LectureReviewService } from '@src/lecture/services/lecture-review.service';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { CreateLectureReviewDto } from '../dtos/create-lecture-review.dto';
import { ReadManyLectureReviewQueryDto } from '../dtos/read-many-lecture-review-query.dto';
import { ApiReadManyLectureReview } from '../swagger-decorators/read-many-lecture-review-decorator';
import { UpdateLectureReviewDto } from '../dtos/update-lecture-review.dto';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { ApiReadManyReservationThatCanBeCreated } from '../swagger-decorators/read-many-reservation-that-can-be-created-decorator';
import { ReadManyLecturerMyReviewQueryDto } from '../dtos/read-many-lecturer-my-review-query.dto';
import { ReadManyLecturerReviewQueryDto } from '../dtos/read-many-lecturer-review-query.dto';
import { AllowUserAndGuestGuard } from '@src/common/guards/allow-user-guest.guard';
import { ApiReadManyLecturerReview } from '../swagger-decorators/read-many-lecturer-review.decorator';
import { ApiLectureReview } from './swagger/lecture.swagger';
import { AllowUserAndLecturerGuard } from '@src/common/guards/allow-user-lecturer.guard';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';

@ApiTags('강의 리뷰')
@Controller('lecture-reviews/:lectureReviewId')
export class LectureReviewController {
  constructor(private readonly lectureReviewService: LectureReviewService) {}

  @ApiOperation({ summary: '리뷰 생성' })
  @ApiBearerAuth()
  @UseGuards(UserAccessTokenGuard)
  @Post()
  async createLectureReview(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createLectureReviewDto: CreateLectureReviewDto,
  ) {
    const createdLectureReview =
      await this.lectureReviewService.createLectureReview(
        authorizedData.user.id,
        createLectureReviewDto,
      );

    return { createdLectureReview };
  }

  @ApiOperation({ summary: '강의 리뷰 수정' })
  @Patch()
  async updateLectureReview(
    @Param('lectureReviewId', ParseIntPipe) lectureReviewId: number,
    @Body() updateLectureReview: UpdateLectureReviewDto,
  ) {
    const updatedLectureReview =
      await this.lectureReviewService.updateLectureReview(
        lectureReviewId,
        updateLectureReview,
      );

    return { updatedLectureReview };
  }

  @ApiReadManyLectureReview()
  @UseGuards(AllowUserAndGuestGuard)
  @Get('lectures/:lectureId')
  async readManyLectureReviewWithUserId(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() query: ReadManyLectureReviewQueryDto,
    @Param('lectureId', ParseIntPipe) lectureId: number,
  ) {
    const userId = authorizedData?.user?.id;
    return await this.lectureReviewService.readManyLectureReviewWithUserId(
      lectureId,
      query,
      userId,
    );
  }

  @ApiLectureReview.DeleteLectureReview({ summary: '강의 리뷰 삭제' })
  @UseGuards(UserAccessTokenGuard)
  @Delete()
  async deleteLectureReview(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('lectureReviewId', ParseIntPipe) lectureReviewId: number,
  ) {
    const userId = authorizedData.user.id;
    const deletedLectureReview =
      await this.lectureReviewService.deleteLectureReview(
        lectureReviewId,
        userId,
      );

    return { deletedLectureReview };
  }

  @ApiLectureReview.GetMyReviewWithUserId({
    summary: '유저 내 리뷰 조회',
  })
  @UseGuards(UserAccessTokenGuard)
  @Get('my-reviews/users')
  async getMyReviewWithUserId(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() query: ReadManyLectureReviewQueryDto,
  ) {
    return await this.lectureReviewService.readManyMyReviewWithUserId(
      authorizedData.user.id,
      query,
    );
  }

  @ApiReadManyReservationThatCanBeCreated()
  @UseGuards(UserAccessTokenGuard)
  @Get('reservations')
  async readManyReservationThatCanBeCreated(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ) {
    const reservation =
      await this.lectureReviewService.readManyReservationThatCanBeCreated(
        authorizedData.user.id,
      );

    return { reservation };
  }

  @ApiLectureReview.GetMyReviewWithLecturerId({ summary: '강사 내 리뷰 조회' })
  @UseGuards(LecturerAccessTokenGuard)
  @Get('my-reviews/lecturers')
  async getMyReviewWithLecturerId(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() query: ReadManyLecturerMyReviewQueryDto,
  ) {
    return await this.lectureReviewService.readManyMyReviewWithLecturerId(
      authorizedData.lecturer.id,
      query,
    );
  }

  @ApiReadManyLecturerReview()
  @UseGuards(AllowUserAndGuestGuard)
  @Get('lecturers/:lecturerId')
  async readManyLecturerReviewWithUserId(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() query: ReadManyLecturerReviewQueryDto,
    @Param('lecturerId', ParseIntPipe) lecturerId: number,
  ) {
    const userId = authorizedData?.user?.id;

    return await this.lectureReviewService.readManyLecturerReview(
      lecturerId,
      query,
      userId,
    );
  }

  @SetResponseKey('reviewRatings')
  @ApiLectureReview.GetReviewRatingsAndCounts({
    summary: '리뷰 점수별 개수 조회',
  })
  @UseGuards(AllowUserAndLecturerGuard)
  @Get('ratings')
  async getReviewRatingsAndCounts(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ) {
    return await this.lectureReviewService.getReviewRatingsAndCounts(
      authorizedData,
    );
  }
}
