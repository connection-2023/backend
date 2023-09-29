import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Lecturer, Users } from '@prisma/client';
import { Response } from 'express';
import { UserRefreshTokenGuard } from '@src/common/guards/user-refresh-token.guard';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { TokenTypes } from '@src/auth/enums/token-enums';
import { LecturerRefreshTokenGuard } from '@src/common/guards/lecturer-refresh-token.guard';
import { Token } from '@src/common/interface/common-interface';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { AuthTokenService } from '@src/auth/services/auth-token.service';

@Controller('auth/token')
export class AuthTokenController {
  constructor(private readonly authTokenService: AuthTokenService) {}

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

    return { accessToken: token.accessToken };
  }

  //유저 토큰 재발급
  @Get('/user/refresh')
  @UseGuards(UserRefreshTokenGuard)
  async refreshUserJwtToken(
    @GetAuthorizedUser() authorizedUser: Users,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token: Token = await this.authTokenService.regenerateToken(
      { userId: authorizedUser.id },
      TokenTypes.User,
    );
    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
    });

    return { accessToken: token.accessToken };
  }

  //강사 토큰 재발급
  @Get('/lecturer/refresh')
  @UseGuards(LecturerRefreshTokenGuard)
  async refreshLecturerJwtToken(
    @GetAuthorizedUser() authorizedUser: Lecturer,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token: Token = await this.authTokenService.regenerateToken(
      { lecturerId: authorizedUser.id },
      TokenTypes.Lecturer,
    );
    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
    });

    return { accessToken: token.accessToken };
  }

  //유저 -> 강사 전환
  @Get('/switch-user-to-lecturer')
  @UseGuards(UserAccessTokenGuard)
  async switchUserToLecturer(
    @GetAuthorizedUser() authorizedUser: Users,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token: Token = await this.authTokenService.switchUserToLecturer(
      authorizedUser,
    );

    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
    });

    return { accessToken: token.accessToken };
  }

  //강사 -> 유저 전환
  @Get('/switch-lecturer-to-user')
  @UseGuards(LecturerAccessTokenGuard)
  async switchLecturerToUser(
    @GetAuthorizedUser() authorizedUser: Lecturer,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token: Token = await this.authTokenService.switchLecturerToUser(
      authorizedUser,
    );

    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
    });

    return { accessToken: token.accessToken };
  }
}
