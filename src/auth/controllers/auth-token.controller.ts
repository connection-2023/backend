import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Lecturer, Users } from '@prisma/client';
import { Response } from 'express';
import { UserRefreshTokenGuard } from '@src/common/guards/user-refresh-token.guard';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { TokenTypes } from '@src/auth/enums/token-enums';
import { LecturerRefreshTokenGuard } from '@src/common/guards/lecturer-refresh-token.guard';
import { Token, ValidateResult } from '@src/common/interface/common-interface';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { AuthTokenService } from '@src/auth/services/auth-token.service';
import { ApiRefreshUserJwtToken } from '../swagger-decorators/token/refresh-user-jwt-decorator';
import { ApiRefreshLecturerJwtToken } from '../swagger-decorators/token/refresh-lecturer-jwt-decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiSwitchUserToLecturer } from '../swagger-decorators/token/switch-user-to-lecturer-decorator';
import { ApiSwitchLecturerToUser } from '../swagger-decorators/token/switch-lecturer-to-user-decorator';
import { AuthGuard } from '@nestjs/passport';
import { Payload } from '@prisma/client/runtime';
import { ApiRefreshToken } from '../swagger-decorators/token/refresh-target-decorator';

@ApiTags('토큰')
@Controller('auth/token')
export class AuthTokenController {
  constructor(private readonly authTokenService: AuthTokenService) {}

  @ApiOperation({
    summary: '유저 AccessToken 유효성 검사',
    description: '서버 랜더링 전용',
  })
  @ApiBearerAuth()
  @Get('/verify/user-access-token')
  @UseGuards(UserAccessTokenGuard)
  async verifyUserAccessToken() {}

  @ApiOperation({
    summary: '강사 AccessToken 유효성 검사',
    description: '서버 랜더링 전용',
  })
  @ApiBearerAuth()
  @Get('/verify/lecturer-access-token')
  @UseGuards(LecturerAccessTokenGuard)
  async verifyLecturerAccessToken() {}

  //토큰 생성을 위한 임시 url
  @Get('/test/:userId')
  async getAccessToken(
    @Param('userId') userId: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token: Token = await this.authTokenService.generateToken(
      { userId },
      TokenTypes.User,
    );

    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
    });

    return { userAccessToken: token.accessToken };
  }

  //토큰 생성을 위한 임시 url
  @Get('/test/admin/:adminId')
  async getAdminAccessToken(
    @Param('adminId') adminId: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token: Token = await this.authTokenService.generateToken(
      { adminId },
      TokenTypes.Admin,
    );

    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
    });

    return { adminAccessToken: token.accessToken };
  }

  //유저 토큰 재발급
  // @ApiRefreshUserJwtToken()
  // @Get('/user/refresh')
  // @UseGuards(UserRefreshTokenGuard)
  // async refreshUserJwtToken(
  //   @GetAuthorizedUser() authorizedUser: ValidateResult,
  //   @Res({ passthrough: true }) response: Response,
  // ) {
  //   const token: Token = await this.authTokenService.regenerateToken(
  //     { userId: authorizedUser.user.id },
  //     TokenTypes.User,
  //   );
  //   response.cookie('refreshToken', token.refreshToken, {
  //     httpOnly: true,
  //   });

  //   return { userAccessToken: token.accessToken };
  // }

  //강사 토큰 재발급
  // @ApiRefreshLecturerJwtToken()
  // @Get('/lecturer/refresh')
  // @UseGuards(LecturerRefreshTokenGuard)
  // async refreshLecturerJwtToken(
  //   @GetAuthorizedUser() authorizedUser: ValidateResult,
  //   @Res({ passthrough: true }) response: Response,
  // ) {
  //   const token: Token = await this.authTokenService.regenerateToken(
  //     { lecturerId: authorizedUser.lecturer.id },
  //     TokenTypes.Lecturer,
  //   );
  //   response.cookie('refreshToken', token.refreshToken, {
  //     httpOnly: true,
  //   });

  //   return { lecturerAccessToken: token.accessToken };
  // }

  //유저 -> 강사 전환
  @ApiSwitchUserToLecturer()
  @Get('/switch-user-to-lecturer')
  @UseGuards(UserAccessTokenGuard)
  async switchUserToLecturer(
    @GetAuthorizedUser() authorizedUser: ValidateResult,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token: Token = await this.authTokenService.switchUserToLecturer(
      authorizedUser,
    );

    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
    });

    return { lecturerAccessToken: token.accessToken };
  }

  //강사 -> 유저 전환
  @ApiSwitchLecturerToUser()
  @Get('/switch-lecturer-to-user')
  @UseGuards(LecturerAccessTokenGuard)
  async switchLecturerToUser(
    @GetAuthorizedUser() authorizedUser: ValidateResult,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token: Token = await this.authTokenService.switchLecturerToUser(
      authorizedUser,
    );

    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
    });

    return { userAccessToken: token.accessToken };
  }

  @ApiRefreshToken()
  @Get('/refresh')
  @UseGuards(AuthGuard('refreshToken'))
  async refreshTargetToken(
    @GetAuthorizedUser() authorizedTarget: ValidateResult,
    @Res({ passthrough: true }) response: Response,
  ) {
    const targetId = {
      userId: authorizedTarget.user?.id,
      lecturerId: authorizedTarget.lecturer?.id,
    };

    const token: Token = await this.authTokenService.regenerateToken(
      targetId,
      authorizedTarget.tokenType,
    );
    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
    });

    if (authorizedTarget.user) {
      return { userAccessToken: token.accessToken };
    }

    if (authorizedTarget.lecturer) {
      return { lecturerAccessToken: token.accessToken };
    }
  }
}
