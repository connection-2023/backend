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
import { ApiReadManyLectureReviewNonMember } from '../swagger-decorators/read-many-lecture-review-non-member-decorator';
import { ApiReadManyLectureMyReview } from '../swagger-decorators/read-many-lecture-my-review-decorator';
import { ApiReadManyReservationThatCanBeCreated } from '../swagger-decorators/read-many-reservation-that-can-be-created-decorator';
import { ReadManyLecturerMyReviewQueryDto } from '../dtos/read-many-lecturer-my-review-query.dto';
import { ApiReadManyLecturerMyReview } from '../swagger-decorators/read-many-lecturer-my-reivew-decorator';
import { ReadManyLecturerReviewQueryDto } from '../dtos/read-many-lecturer-review-query.dto';
import { ApiReadManyLecturerReviewWithUserId } from '../swagger-decorators/read-many-lecturer-review-with-user-id-decorator';
import { ApiReadManyLecturerReview } from '../swagger-decorators/read-many-lecturer-reivew-decorator';
import { AllowUserAndGuestGuard } from '@src/common/guards/allow-user-guest.guard';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';

@ApiTags('강의 리뷰')
@Controller('lecture-reviews')
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
  @Patch(':lectureReviewId')
  async updateLectureReview(
    @Param('lectureReviewId', ParseIntPipe) lectureReveiwId: number,
    @Body() updateLectureReview: UpdateLectureReviewDto,
  ) {
    const updatedLectureReview =
      await this.lectureReviewService.updateLectureReview(
        lectureReveiwId,
        updateLectureReview,
      );

    return { updatedLectureReview };
  }

  @ApiReadManyLectureReview()
  @SetResponseKey('review')
  @UseGuards(AllowUserAndGuestGuard)
  @Get('lectures/:lectureId')
  async readManyLectureReviewWithUserId(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() query: ReadManyLectureReviewQueryDto,
    @Param('lectureId', ParseIntPipe) lectureId: number,
  ) {
    const { orderBy } = query;
    const userId = authorizedData?.user?.id;
    return await this.lectureReviewService.readManyLectureReviewWithUserId(
      lectureId,
      orderBy,
      userId,
    );
  }

  @ApiOperation({ summary: '강의 리뷰 삭제' })
  @Delete(':lectureReviewId')
  async deleteLectureReview(
    @Param('lectureReviewId', ParseIntPipe) lectureReviewId: number,
  ) {
    const deletedLectureReview =
      await this.lectureReviewService.deleteLectureReview(lectureReviewId);

    return { deletedLectureReview };
  }

  @ApiReadManyLectureMyReview()
  @UseGuards(UserAccessTokenGuard)
  @Get('my-reviews/users')
  async readManyMyReviewWithUserId(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() query: ReadManyLectureReviewQueryDto,
  ) {
    const review = await this.lectureReviewService.readManyMyReviewWithUserId(
      authorizedData.user.id,
      query,
    );

    return { review };
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

  @ApiReadManyLecturerMyReview()
  @UseGuards(LecturerAccessTokenGuard)
  @Get('my-reviews/lecturers')
  async readManyMyReviewWithLecturerId(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() query: ReadManyLecturerMyReviewQueryDto,
  ) {
    return await this.lectureReviewService.readManyMyReviewWithLecturerId(
      authorizedData.lecturer.id,
      query,
    );
  }

  @ApiReadManyLecturerReviewWithUserId()
  @UseGuards(UserAccessTokenGuard)
  @Get('lecturers/:lecturerId/users')
  async readManyLecturerReviewWithUserId(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() query: ReadManyLecturerReviewQueryDto,
    @Param('lecturerId', ParseIntPipe) lecturerId: number,
  ) {
    return await this.lectureReviewService.readManyLecturerReviewWithUserId(
      lecturerId,
      authorizedData.user.id,
      query,
    );
  }

  @ApiReadManyLecturerReview()
  @Get('lecturers/:lecturerId/non-members')
  async readManyLecturerReview(
    @Query() query: ReadManyLecturerReviewQueryDto,
    @Param('lecturerId', ParseIntPipe) lecturerId: number,
  ) {
    return await this.lectureReviewService.readManyLecturerReview(
      lecturerId,
      query,
    );
  }
}
