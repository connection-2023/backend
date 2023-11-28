import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { ValidateResult } from '@src/common/interface/common-interface';
import { CreateLecturePassDto } from '@src/pass/dtos/create-lecture-pass.dto';
import { PassService } from '@src/pass/services/pass.service';
import { ApiCreateLecturePass } from '@src/pass/swagger-decorators/create-lecture-pass.decorator';
import { GetMyIssuedPassListDto } from '../dtos/get-my-issued-pass-list.dto';
import { ApiGetMyIssuedPassList } from '../swagger-decorators/get-my-issued-pass-list.decorator';

@ApiTags('패스권')
@Controller('passes')
export class PassController {
  constructor(private passService: PassService) {}

  @ApiCreateLecturePass()
  @Post('/lecture')
  @UseGuards(LecturerAccessTokenGuard)
  async createLecturePass(
    @GetAuthorizedUser() AuthorizedData: ValidateResult,
    @Body() createLecturePassDto: CreateLecturePassDto,
  ) {
    await this.passService.createLecturePass(
      AuthorizedData.lecturer.id,
      createLecturePassDto,
    );
  }
  @ApiGetMyIssuedPassList()
  @Get('/lecturer')
  @UseGuards(LecturerAccessTokenGuard)
  async getMyIssuedCouponList(
    @GetAuthorizedUser() AuthorizedData: ValidateResult,
    @Query() getMyIssuedPassListDto: GetMyIssuedPassListDto,
  ) {
    return await this.passService.getMyIssuedPassList(
      AuthorizedData.lecturer.id,
      getMyIssuedPassListDto,
    );
  }
}
