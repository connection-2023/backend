import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserPassService } from '../services/user-pass.service';
import { plainToInstance } from 'class-transformer';
import { UserPassDto } from '@src/common/dtos/user-pass.dto';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { GetUserPassListDto } from '../dtos/request/get-user-pass-list.dto';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ApiUserPass } from './swagger/user-pass.swagger';
import { PassReservationDto } from '../dtos/response/pass-history.dto';
import { UserPassInfoDto } from '../dtos/response/user-pass-info.dto';

@ApiTags('유저 패스권')
@Controller('user-passes')
export class UserPassController {
  constructor(private readonly userPassService: UserPassService) {}

  @ApiUserPass.GetUserPassList({ summary: '보유 패스권 목록 조회' })
  @SetResponseKey('userPassList')
  @Get()
  @UseGuards(UserAccessTokenGuard)
  async getUserPassList(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() getUserPassListDto: GetUserPassListDto,
  ): Promise<{
    totalItemCount: number;
    userPassList: UserPassDto[];
  }> {
    const { totalItemCount, userPassList } =
      await this.userPassService.getPassList(
        authorizedData.user.id,
        getUserPassListDto,
      );

    return {
      totalItemCount,
      userPassList: plainToInstance(UserPassDto, userPassList),
    };
  }

  @ApiUserPass.GetUserPassInfo({ summary: '패스권 정보 조회' })
  @SetResponseKey('userPassInfo')
  @Get('/:passId')
  @UseGuards(UserAccessTokenGuard)
  async getUserPassInfo(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('passId', ParseIntPipe) passId: number,
  ): Promise<UserPassInfoDto> {
    const passInfo = await this.userPassService.getPassHistory(
      authorizedData.user.id,
      passId,
    );

    return plainToInstance(UserPassInfoDto, passInfo);
  }

  @ApiUserPass.GetUserPassByLectureId({
    summary: '강의별 사용 가능한 패스권 조회',
  })
  @SetResponseKey('usablePassList')
  @Get('/lectures/:lectureId')
  @UseGuards(UserAccessTokenGuard)
  async getUserPassByLectureId(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('lectureId', ParseIntPipe) lectureId: number,
  ) {
    const usablePassList = await this.userPassService.getUsablePassList(
      authorizedData.user.id,
      lectureId,
    );

    return plainToInstance(UserPassDto, usablePassList);
  }
}
