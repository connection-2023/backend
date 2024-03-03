import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
import { MyPassDto } from '../dtos/pass.dto';
import { ApiGetMyIssuedPass } from '../swagger-decorators/get-my-issued-pass.decorator';
import { PassWithLecturerDto } from '../dtos/response/pass-with-lecturer.dto';
import { ApiGetPass } from '../swagger-decorators/get-pass.decorator';
import { ApiPass } from './swagger/pass.swagger';

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
  @Get('/issued')
  @UseGuards(LecturerAccessTokenGuard)
  async getMyIssuedPassList(
    @GetAuthorizedUser() AuthorizedData: ValidateResult,
    @Query() getMyIssuedPassListDto: GetMyIssuedPassListDto,
  ) {
    return await this.passService.getMyIssuedPassList(
      AuthorizedData.lecturer.id,
      getMyIssuedPassListDto,
    );
  }

  @ApiGetPass()
  @SetResponseKey('pass')
  @Get('/:passId')
  async getPass(
    @Param('passId', ParseIntPipe) passId: number,
  ): Promise<PassWithLecturerDto> {
    return await this.passService.getPass(passId);
  }

  @ApiGetMyIssuedPass()
  @SetResponseKey('myPass')
  @Get('/issued/:passId')
  @UseGuards(LecturerAccessTokenGuard)
  async getMyPass(
    @GetAuthorizedUser() AuthorizedData: ValidateResult,
    @Param('passId', ParseIntPipe) passId: number,
  ): Promise<MyPassDto> {
    return await this.passService.getMyPass(AuthorizedData.lecturer.id, passId);
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

  @ApiPass.DeactivatePass({ summary: '패스권 판매 비활성화' })
  @UseGuards(LecturerAccessTokenGuard)
  @Patch('/:passId/deactivate')
  async deactivatePass(
    @GetAuthorizedUser() AuthorizedData: ValidateResult,
    @Param('passId', ParseIntPipe) passId: number,
  ): Promise<void> {
    await this.passService.deactivatePass(AuthorizedData.lecturer.id, passId);
  }
}
