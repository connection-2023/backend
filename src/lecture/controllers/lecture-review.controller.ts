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
  @UseGuards(UserAccessTokenGuard)
  @Get(':lectureId/users')
  async readManyLectureReviewWithUserId(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() query: ReadManyLectureReviewQueryDto,
    @Param('lectureId', ParseIntPipe) lectureId: number,
  ) {
    const { orderBy } = query;
    const review =
      await this.lectureReviewService.readManyLectureReviewWithUserId(
        authorizedData.user.id,
        lectureId,
        orderBy,
      );

    return { review };
  }

  @ApiReadManyLectureReviewNonMember()
  @Get(':lectureId/non-members')
  async readManyLectureReviewWithNonMember(
    @Query() query: ReadManyLectureReviewQueryDto,
    @Param('lectureId', ParseIntPipe) lectureId: number,
  ) {
    const { orderBy } = query;
    const review =
      await this.lectureReviewService.readManyLectureReviewNonMember(
        lectureId,
        orderBy,
      );

    return { review };
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

  @ApiOperation({ summary: '작성한 리뷰 조회' })
  @ApiBearerAuth()
  @UseGuards(UserAccessTokenGuard)
  @Get('my-reviews')
  async readManyMyReview(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() query: ReadManyLectureReviewQueryDto,
  ) {
    const review = await this.lectureReviewService.readManyMyReview(
      authorizedData.user.id,
      query,
    );

    return { review };
  }
}
