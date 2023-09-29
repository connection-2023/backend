import {
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PhoneNumberDto } from '@src/auth/dtos/phone-number.dto';
import { CheckVerificationCodeDto } from '@src/auth/dtos/check-verification-code.dto';
import { AuthService } from '@src/auth/services/auth.service';
import { Token } from '@src/common/interface/common-interface';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { Lecture, Lecturer, Users } from '@prisma/client';
import { Response } from 'express';
import { UserRefreshTokenGuard } from '@src/common/guards/user-refresh-token.guard';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { TokenTypes } from '@src/auth/enums/token-enums';
import { LecturerRefreshTokenGuard } from '@src/common/guards/lecturer-refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //토큰 생성을 위한 임시 url
  @Get('/test/:userId')
  async getAccessToken(
    @Param('userId') userId: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token: Token = await this.authService.generateToken(
      { userId },
      TokenTypes.User,
    );

    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
    });

    return { accessToken: token.accessToken };
  }

  //유저 토큰 재발급
  @Get('/token/user/refresh')
  @UseGuards(UserRefreshTokenGuard)
  async refreshUserJwtToken(
    @GetAuthorizedUser() authorizedUser: Users,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token: Token = await this.authService.regenerateToken(
      { userId: authorizedUser.id },
      TokenTypes.User,
    );
    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
    });

    return { accessToken: token.accessToken };
  }

  //강사 토큰 재발급
  @Get('/token/lecturer/refresh')
  @UseGuards(LecturerRefreshTokenGuard)
  async refreshLecturerJwtToken(
    @GetAuthorizedUser() authorizedUser: Lecturer,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token: Token = await this.authService.regenerateToken(
      { lecturerId: authorizedUser.id },
      TokenTypes.Lecturer,
    );
    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
    });

    return { accessToken: token.accessToken };
  }

  //유저 -> 강사 전환
  @Get('/token/switch-user-to-lecturer')
  @UseGuards(UserAccessTokenGuard)
  async switchUserToLecturer(
    @GetAuthorizedUser() authorizedUser: Users,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token: Token = await this.authService.switchUserToLecturer(
      authorizedUser,
    );

    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
    });

    return { accessToken: token.accessToken };
  }

  //강사 -> 유저 전환
  @Get('/token/switch-lecturer-to-user')
  @UseGuards(LecturerAccessTokenGuard)
  async switchLecturerToUser(
    @GetAuthorizedUser() authorizedUser: Lecturer,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token: Token = await this.authService.switchLecturerToUser(
      authorizedUser,
    );

    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
    });

    return { accessToken: token.accessToken };
  }

  @Post('/SMS')
  @UseGuards(UserAccessTokenGuard)
  async sendSMS(
    @GetAuthorizedUser() authorizedUser: Users,
    @Query() phoneNumberDto: PhoneNumberDto,
  ) {
    await this.authService.sendVerificationCode(
      authorizedUser.id,
      phoneNumberDto.userPhoneNumber,
    );

    return { message: '인증번호가 발송 되었습니다.' };
  }

  @Get('/SMS')
  async checkVerificationCode(
    @Query() checkVerificationCodeDto: CheckVerificationCodeDto,
  ) {
    await this.authService.checkVerificationCode(checkVerificationCodeDto);

    return { message: '전화번호 인증에 성공하였습니다.' };
  }
}
