import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PhoneNumberDto } from '../dtos/phone-number.dto';
import { CheckVerificationCodeDto } from '../dtos/check-verification-code.dto';
import { AuthService } from '../services/auth.service';
import { Token } from 'src/common/interface/common-interface';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { GetAuthorizedUser } from 'src/common/decorator/get-user.decorator';
import { Users } from '@prisma/client';
import { Response } from 'express';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //토큰 생성을 위한 임시 url
  @Get('/test/:userId')
  async getAccessToken(
    @Param('userId') userId: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token: Token = await this.authService.generateToken({ userId });
    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
    });

    return { accessToken: token.accessToken };
  }

  @Get('/token')
  @UseGuards(RefreshTokenGuard)
  async refreshJwtToken(
    @GetAuthorizedUser() authorizedUser: Users,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token: Token = await this.authService.regenerateToken(authorizedUser);
    response.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
    });

    return { accessToken: token.accessToken };
  }

  @Post('/SMS')
  @UseGuards(AccessTokenGuard)
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
