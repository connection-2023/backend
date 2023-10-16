import {
  Body,
  Controller,
  Get,
  Param,
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
import { LecturerCoupon } from '@src/lecturer/interface/lecturer.interface';
import { ApiGetMyCoupons } from '@src/lecturer/swagger-decorators/get-my-coupons-decorater';

@ApiTags('강사')
@Controller('lecturers')
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  @ApiCreateLecturer()
  @UseInterceptors(FilesInterceptor('image', 5))
  @Post('/')
  @UseGuards(UserAccessTokenGuard)
  async createLecturer(
    @GetAuthorizedUser() user: Users,
    @UploadedFiles() profileImages: Express.Multer.File[],
    @Body() createLecturerDto: CreateLecturerDto,
  ) {
    await this.lecturerService.createLecturer(
      user.id,
      profileImages,
      createLecturerDto,
    );

    return { message: '강사 생성 완료' };
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
  @Get('/:nickname')
  async checkAvailableNickname(@Param('nickname') nickname: string) {
    const result: Boolean = await this.lecturerService.checkAvailableNickname(
      nickname,
    );

    return { status: result };
  }
}
