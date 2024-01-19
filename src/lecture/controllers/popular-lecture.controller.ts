import { PopularLectureService } from './../services/popular-lecture.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ApiReadManyPopularLecturesWithUserId } from '../swagger-decorators/read-many-popular-lecture-with-user-id.decorator';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { ApiReadManyPopularLecturesByNonMember } from '../swagger-decorators/read-many-popular-lectures-by-non-member.decorator';
import { AllowUserAndGuestGuard } from '@src/common/guards/allow-user-guest.guard';

@ApiTags('인기 강의')
@Controller('popular-lectures')
export class PopularLectureController {
  constructor(private readonly popularLectureService: PopularLectureService) {}

  @ApiReadManyPopularLecturesWithUserId()
  @SetResponseKey('lectures')
  @UseGuards(AllowUserAndGuestGuard)
  @Get()
  async readManyPopularLecturesWithUserId(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ) {
    const userId = authorizedData?.user?.id;
    return await this.popularLectureService.readPopularLecture(userId);
  }
}
