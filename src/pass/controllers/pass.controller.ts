import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { ValidateResult } from '@src/common/interface/common-interface';
import { CreateLecturePassDto } from '@src/pass/dtos/create-lecture-pass.dto';
import { PassService } from '@src/pass/services/pass.service';
import { ApiCreateLecturePass } from '@src/pass/swagger-decorators/create-lecture-pass.decorator';
import { GetMyIssuedPassListDto } from '@src/pass/dtos/get-my-issued-pass-list.dto';
import { ApiGetMyIssuedPassList } from '@src/pass/swagger-decorators/get-my-issued-pass-list.decorator';
import { LecturePassWithTargetDto } from '@src/common/dtos/lecture-pass-with-target.dto';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { ApiGetLecturePassList } from '@src/pass/swagger-decorators/get-lecture-pass-list.decorator';
import { ApiGetLecturerPassList } from '@src/pass/swagger-decorators/get-lecturer-pass-list.decorator';

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

  @ApiGetLecturePassList()
  @Get('/lectures/:lectureId')
  @SetResponseKey('passList')
  async getLecturePasses(
    @Param('lectureId', ParseIntPipe) lectureId: number,
  ): Promise<LecturePassWithTargetDto[]> {
    return await this.passService.getLecturePassList(lectureId);
  }

  @ApiGetLecturerPassList()
  @Get('/lecturers/:lecturerId')
  @SetResponseKey('passList')
  async getLecturerPasses(
    @Param('lecturerId', ParseIntPipe) lecturerId: number,
  ): Promise<LecturePassWithTargetDto[]> {
    return await this.passService.getLecturerPassList(lecturerId);
  }
}
