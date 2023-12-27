import { PopularLecturerService } from './../services/popular-lecturer.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ApiGetPopularLecturer } from '../swagger-decorators/get-popular-lecturer.decorator';

@ApiTags('인기 강사')
@Controller('popular-lecturers')
export class PopularLecturerController {
  constructor(
    private readonly popularLecturerService: PopularLecturerService,
  ) {}

  @ApiGetPopularLecturer()
  @UseGuards(UserAccessTokenGuard)
  @Get()
  async readManyPopularLecturer(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ) {
    const lecturers = await this.popularLecturerService.readManyPopularLecturer(
      authorizedData.user.id,
    );

    return { lecturers };
  }
}
