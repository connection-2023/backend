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
import { GetMyIssuedPassListDto } from '@src/pass/dtos/get-my-issued-pass-list.dto';
import { LecturePassWithTargetDto } from '@src/common/dtos/lecture-pass-with-target.dto';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { MyPassDto } from '../dtos/pass.dto';
import { PassWithLecturerDto } from '../dtos/response/pass-with-lecturer.dto';
import { ApiPass } from './swagger/pass.swagger';
import { plainToInstance } from 'class-transformer';
import { IssuedPassDto } from '../dtos/response/issued-pass.dto';

@ApiTags('패스권')
@Controller('passes')
export class PassController {
  constructor(private passService: PassService) {}

  @ApiPass.CreateLecturePass({ summary: '강의 패스권 생성' })
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

  @ApiPass.GetMyIssuedPassList({
    summary: '내가(강사) 발급한 패스권 목록 조회',
  })
  @Get('/issued')
  @UseGuards(LecturerAccessTokenGuard)
  async getMyIssuedPassList(
    @GetAuthorizedUser() AuthorizedData: ValidateResult,
    @Query() getMyIssuedPassListDto: GetMyIssuedPassListDto,
  ): Promise<{ totalItemCount: number; passList: IssuedPassDto[] }> {
    const { totalItemCount, passList } =
      await this.passService.getMyIssuedPassList(
        AuthorizedData.lecturer.id,
        getMyIssuedPassListDto,
      );

    return {
      totalItemCount,
      passList: plainToInstance(IssuedPassDto, passList),
    };
  }

  @ApiPass.GetPassById({ summary: '패스권 Id를 통해 패스권 조회' })
  @SetResponseKey('pass')
  @Get('/:passId')
  async getPassById(
    @Param('passId', ParseIntPipe) passId: number,
  ): Promise<PassWithLecturerDto> {
    return await this.passService.getPass(passId);
  }

  @ApiPass.GetMyPass({ summary: '패스권 Id로 발급한 패스권 조회' })
  @SetResponseKey('myPass')
  @Get('/issued/:passId')
  @UseGuards(LecturerAccessTokenGuard)
  async getMyPass(
    @GetAuthorizedUser() AuthorizedData: ValidateResult,
    @Param('passId', ParseIntPipe) passId: number,
  ): Promise<MyPassDto> {
    return await this.passService.getMyPass(AuthorizedData.lecturer.id, passId);
  }

  @ApiPass.GetLecturePasses({ summary: '강의 Id로 패스권 조회' })
  @Get('/lectures/:lectureId')
  @SetResponseKey('passList')
  async getLecturePasses(
    @Param('lectureId', ParseIntPipe) lectureId: number,
  ): Promise<LecturePassWithTargetDto[]> {
    return await this.passService.getLecturePassList(lectureId);
  }

  @ApiPass.GetLecturerPasses({ summary: '강사 Id로 패스권 조회' })
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
