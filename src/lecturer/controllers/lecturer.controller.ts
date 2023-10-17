import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LecturerService } from '@src/lecturer/services/lecturer.service';
import { CreateLecturerDto } from '@src/lecturer/dtos/create-lecturer.dto';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { Users } from '@prisma/client';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { ApiCreateLecturer } from '@src/lecturer/swagger-decorators/create-lecturer-decorator';
import { ApiTags } from '@nestjs/swagger';
import { ApiCheckAvailableNickname } from '@src/lecturer/swagger-decorators/check-available-nickname-decorater';
import { FilesInterceptor } from '@nestjs/platform-express';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { ValidateResult } from '@src/common/interface/common-interface';
import {
  LecturerCoupon,
  LecturerProfile,
} from '@src/lecturer/interface/lecturer.interface';
import { ApiGetMyCoupons } from '@src/lecturer/swagger-decorators/get-my-coupons-decorater';
import { ApiUpdateLecturerNickname } from '@src/lecturer/swagger-decorators/update-lecturer-nickname-decorater';
import { ApiGetMyLecturerProfile } from '@src/lecturer/swagger-decorators/get-my-lecturer-profile-decorater';
import { UpdateMyLecturerProfileDto } from '../dtos/update-my-lecturer-profile.dto';

@ApiTags('강사')
@Controller('lecturers')
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  @ApiCreateLecturer()
  @UseInterceptors(FilesInterceptor('images', 5))
  @Post()
  @UseGuards(UserAccessTokenGuard)
  async createLecturer(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @UploadedFiles() profileImages: Express.Multer.File[],
    @Body() createLecturerDto: CreateLecturerDto,
  ) {
    await this.lecturerService.createLecturer(
      authorizedData.user.id,
      profileImages,
      createLecturerDto,
    );
  }

  @Patch('/profile')
  @UseInterceptors(FilesInterceptor('images', 5))
  @UseGuards(LecturerAccessTokenGuard)
  async updateMyLecturerProfile(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @UploadedFiles() newProfileImages: Express.Multer.File[],
    @Body() updateMyLecturerProfileDto: UpdateMyLecturerProfileDto,
  ) {
    await this.lecturerService.updateMyLecturerProfile(
      authorizedData.lecturer.id,
      newProfileImages,
      updateMyLecturerProfileDto,
    );
  }

  @ApiGetMyLecturerProfile()
  @Get('/profile')
  @UseGuards(LecturerAccessTokenGuard)
  async getMyLecturerProfile(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ) {
    const myLecturerProfile: LecturerProfile =
      await this.lecturerService.getLecturerProfile(authorizedData.lecturer.id);

    return { myLecturerProfile };
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
}
