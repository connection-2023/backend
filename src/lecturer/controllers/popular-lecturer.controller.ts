import { PopularLecturerService } from './../services/popular-lecturer.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiGetPopularLecturer } from '../swagger-decorators/get-popular-lecturer.decorator';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { AllowUserAndGuestGuard } from '@src/common/guards/allow-user-guest.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';

@ApiTags('인기 강사')
@Controller('popular-lecturers')
export class PopularLecturerController {
  constructor(
    private readonly popularLecturerService: PopularLecturerService,
  ) {}

  @ApiGetPopularLecturer()
  @SetResponseKey('lecturers')
  @UseGuards(AllowUserAndGuestGuard)
  @Get()
  async readManyPopularLecturerByNonMember(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ) {
    const userId = authorizedData?.user?.id;
    return await this.popularLecturerService.readManyPopularLecturer(userId);
  }
}
