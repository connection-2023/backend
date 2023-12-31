import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LecturerService } from '@src/lecturer/services/lecturer.service';
import { CreateLecturerDto } from '@src/lecturer/dtos/create-lecturer.dto';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { ApiCreateLecturer } from '@src/lecturer/swagger-decorators/create-lecturer-decorator';
import { ApiTags } from '@nestjs/swagger';
import { ApiCheckAvailableNickname } from '@src/lecturer/swagger-decorators/check-available-nickname-decorater';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { ValidateResult } from '@src/common/interface/common-interface';
import {
  LecturerBasicProfile,
  LecturerCoupon,
  LecturerProfile,
} from '@src/lecturer/interface/lecturer.interface';
import { ApiGetMyCoupons } from '@src/lecturer/swagger-decorators/get-my-coupons-decorater';
import { ApiUpdateLecturerNickname } from '@src/lecturer/swagger-decorators/update-lecturer-nickname-decorater';
import { ApiGetLecturerProfile } from '@src/lecturer/swagger-decorators/get-my-lecturer-profile-decorater';
import { UpdateMyLecturerProfileDto } from '@src/lecturer/dtos/update-my-lecturer-profile.dto';
import { ApiUpdateLecturerProfile } from '@src/lecturer/swagger-decorators/update-lecturer-profile-decorator';
import { ApiGetLecturerBasicProfile } from '@src/lecturer/swagger-decorators/get-lecturer-profile-card-decorater';
import { LecturerDetailProfileDto } from '../dtos/lecturer-detail-profile.dto';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { LecturerLearnerDto } from '@src/common/dtos/lecturer-learner.dto';
import { GetLecturerLearnerListDto } from '../dtos/get-lecturer-learner-list.dto';
import { LecturerLearnerListDto } from '../dtos/lecturer-learner-list.dto';
import { ApiGetLecturerLearnerList } from '../swagger-decorators/get-lecturer-learner-list.decorator';
import { AllowUserAndGuestGuard } from '@src/common/guards/allow-user-guest.guard';

@ApiTags('강사')
@Controller('lecturers')
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  @ApiCreateLecturer()
  @Post()
  @UseGuards(UserAccessTokenGuard)
  async createLecturer(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createLecturerDto: CreateLecturerDto,
  ) {
    await this.lecturerService.createLecturer(
      authorizedData.user.id,
      createLecturerDto,
    );
  }

  @ApiUpdateLecturerProfile()
  @Patch('/profile')
  @UseGuards(LecturerAccessTokenGuard)
  async updateMyLecturerProfile(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() updateMyLecturerProfileDto: UpdateMyLecturerProfileDto,
  ) {
    await this.lecturerService.updateMyLecturerProfile(
      authorizedData.lecturer.id,
      updateMyLecturerProfileDto,
    );
  }

  @ApiGetLecturerProfile()
  @SetResponseKey('lecturerProfile')
  @UseGuards(AllowUserAndGuestGuard)
  @Get('/profile/:lecturerId')
  async getLecturerProfile(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('lecturerId') lecturerId: number,
  ): Promise<LecturerDetailProfileDto> {
    const userId: number = authorizedData?.user?.id;

    return await this.lecturerService.getLecturerProfile(userId, lecturerId);
  }

  @ApiGetLecturerBasicProfile()
  @Get('/my-basic-profile')
  @UseGuards(LecturerAccessTokenGuard)
  async getMyLecturerBasicProfile(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ) {
    const lecturerBasicProfile: LecturerBasicProfile =
      await this.lecturerService.getLecturerBasicProfile(
        authorizedData.lecturer.id,
      );

    return { lecturerBasicProfile };
  }

  @ApiGetMyCoupons()
  @Get('/my-coupons')
  @UseGuards(LecturerAccessTokenGuard)
  async getMyCoupons(@GetAuthorizedUser() authorizedData: ValidateResult) {
    const coupons: LecturerCoupon[] =
      await this.lecturerService.getLecturerCoupons(authorizedData.lecturer.id);

    return { coupons };
  }

  @ApiCheckAvailableNickname()
  @Get('/nickname/:nickname')
  async checkAvailableNickname(@Param('nickname') nickname: string) {
    const result: Boolean = await this.lecturerService.checkAvailableNickname(
      nickname,
    );

    return { isAvailable: result };
  }

  @ApiUpdateLecturerNickname()
  @Patch('/nickname/:nickname')
  @UseGuards(LecturerAccessTokenGuard)
  async updateLecturerNickname(
    @Param('nickname') nickname: string,
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ) {
    await this.lecturerService.updateLecturerNickname(
      authorizedData.lecturer.id,
      nickname,
    );
  }

  @ApiGetLecturerLearnerList()
  @Get('/learners')
  @UseGuards(LecturerAccessTokenGuard)
  async getLecturerLearnerList(
    @Query() getLecturerLearnerListDto: GetLecturerLearnerListDto,
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ): Promise<LecturerLearnerListDto> {
    return await this.lecturerService.getLecturerLearners(
      authorizedData.lecturer.id,
      getLecturerLearnerListDto,
    );
  }
}
