import { LectureService } from '@src/lecture/services/lecture.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiReadManylatestLectures } from '../swagger-decorators/read-many-latest-lectures.decorator';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ApiReadManylatestLecturesByNonMember } from '../swagger-decorators/read-many-latest-lectures-by-non-member.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { LatestLectureService } from '../services/latest-lecture.service';

@ApiTags('강의')
@Controller('latest-lectures')
export class LatestLectureController {
  constructor(private readonly latestLectureService: LatestLectureService) {}

  @ApiReadManylatestLectures()
  @SetResponseKey('lectures')
  @UseGuards(UserAccessTokenGuard)
  @Get('users')
  async readManyLatestLecture(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ) {
    return await this.latestLectureService.readManyLatestLectureWithUserId(
      authorizedData.user.id,
    );
  }

  @ApiReadManylatestLecturesByNonMember()
  @SetResponseKey('lectures')
  @Get('non-members')
  async readManyLatestLecturesByNonMember() {
    return await this.latestLectureService.readManyLatestLecturesByNonMember();
  }
}
