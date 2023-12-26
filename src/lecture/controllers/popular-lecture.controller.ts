import { PopularLectureService } from './../services/popular-lecture.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ApiReadManyPopularLectures } from '../swagger-decorators/read-many-popular-lecture.decorator';

@ApiTags('인기 강의')
@Controller('popular-lectures')
export class PopularLectureController {
  constructor(private readonly popularLectureService: PopularLectureService) {}

  @ApiReadManyPopularLectures()
  @UseGuards(UserAccessTokenGuard)
  @Get()
  async readManyPopularLectures(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ) {
    const lectures =
      await this.popularLectureService.readPopularLectureWithUserId(
        authorizedData.user.id,
      );

    return { lectures };
  }
}
