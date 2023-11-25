import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LectureReviewLikeService } from './../services/lecture-review-like.service';
import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';

@ApiTags('강의 리뷰 좋아요')
@Controller('lecture-review/:reviewId/likes')
export class LectureReviewLikeController {
  constructor(
    private readonly lectureReviewLikeService: LectureReviewLikeService,
  ) {}

  @ApiOperation({ summary: '강의 리뷰 좋아요 생성' })
  @ApiBearerAuth()
  @UseGuards(UserAccessTokenGuard)
  @Post()
  async createLectureReviewLike(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('reviewId', ParseIntPipe) reviewId: number,
  ) {
    const reviewLike =
      await this.lectureReviewLikeService.createLectureReviewLike(
        authorizedData.user.id,
        reviewId,
      );

    return { reviewLike };
  }

  @ApiOperation({ summary: '강의 리뷰 좋아요 삭제' })
  @ApiBearerAuth()
  @UseGuards(UserAccessTokenGuard)
  @Delete()
  async deleteLectureReviewLike(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('reviewId', ParseIntPipe) reviewId: number,
  ) {
    await this.lectureReviewLikeService.deleteLectureReviewLike(
      authorizedData.user.id,
      reviewId,
    );
  }
}
