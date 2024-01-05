import { PopularLecturerService } from './../services/popular-lecturer.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ApiGetPopularLecturer } from '../swagger-decorators/get-popular-lecturer.decorator';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { ApiGetPopularLecturerByNonMember } from '../swagger-decorators/get-popular-lecturer-by-non-member.decorator';

@ApiTags('인기 강사')
@Controller('popular-lecturers')
export class PopularLecturerController {
  constructor(
    private readonly popularLecturerService: PopularLecturerService,
  ) {}

  @ApiGetPopularLecturer()
  @SetResponseKey('lecturers')
  @UseGuards(UserAccessTokenGuard)
  @Get('users')
  async readManyPopularLecturerWithUserId(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ) {
    return await this.popularLecturerService.readManyPopularLecturer(
      authorizedData.user.id,
    );
  }

  @ApiGetPopularLecturerByNonMember()
  @SetResponseKey('lecturers')
  @Get('non-members')
  async readManyPopularLecturerByNonMember() {
    return await this.popularLecturerService.readManyPopularLecturer();
  }
}
