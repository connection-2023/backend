import { LectureLikeService } from '@src/lecture/services/lecture-like.service';
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { ApiCreateLectureLike } from '../swagger-decorators/create-lecture-like-decorator';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ApiReadManyLikedLecture } from '../swagger-decorators/read-many-liked-lecture-decorator';

@ApiTags('강의 좋아요')
@Controller('lecture-likes')
export class LectureLikeController {
  constructor(private readonly lectureLikeService: LectureLikeService) {}

  @ApiCreateLectureLike()
  @UseGuards(UserAccessTokenGuard)
  @Post(':lectureId')
  async createLectureLike(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('lectureId', ParseIntPipe) lectureId: number,
  ) {
    const lectureLike = await this.lectureLikeService.createLikeLecture(
      lectureId,
      authorizedData.user.id,
    );

    return { lectureLike };
  }

  @ApiOperation({ summary: '강의 좋아요 삭제' })
  @ApiBearerAuth()
  @UseGuards(UserAccessTokenGuard)
  @Delete(':lectureId')
  async deleteLectureLike(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('id', ParseIntPipe) lectureId: number,
  ) {
    return await this.lectureLikeService.deleteLikeLecture(
      lectureId,
      authorizedData.user.id,
    );
  }

  @ApiReadManyLikedLecture()
  @UseGuards(UserAccessTokenGuard)
  @Get('users')
  async readManyLikedLecture(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ) {
    const likedLecture = await this.lectureLikeService.readManyLikedLecture(
      authorizedData.user.id,
    );

    return { likedLecture };
  }
}
