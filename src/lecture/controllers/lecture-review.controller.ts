import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
    // return this.lectureReviewService.createLectureReview(
    //   authorizedData.user.id,
    //   createLectureReviewDto,
    // );
  }

  @ApiOperation({ summary: '리뷰 조회' })
  @Get(':lectureId')
  async readManyLectureReview(
    @Query() query: ReadManyLectureReviewQueryDto,
    @Param('lectureId', ParseIntPipe) lectureId: number,
  ) {
    const { orderBy } = query;
    const review = await this.lectureReviewService.readManyLectureReview(
      lectureId,
      orderBy,
    );

    return { review };
  }
}
