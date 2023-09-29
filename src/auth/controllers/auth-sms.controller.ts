import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PhoneNumberDto } from '@src/auth/dtos/phone-number.dto';
import { CheckVerificationCodeDto } from '@src/auth/dtos/check-verification-code.dto';
import { AuthSmsService } from '@src/auth/services/auth-sms.service';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { Users } from '@prisma/client';

@Controller('auth/sms')
export class AuthSmsController {
  constructor(private readonly authSmsService: AuthSmsService) {}

  @Post('/')
  @UseGuards(UserAccessTokenGuard)
  async sendSMS(
    @GetAuthorizedUser() authorizedUser: Users,
    @Query() phoneNumberDto: PhoneNumberDto,
  ) {
    await this.authSmsService.sendVerificationCode(
      authorizedUser.id,
      phoneNumberDto.userPhoneNumber,
    );

    return { message: '인증번호가 발송 되었습니다.' };
  }

  @Get('/')
  async checkVerificationCode(
    @Query() checkVerificationCodeDto: CheckVerificationCodeDto,
  ) {
    await this.authSmsService.checkVerificationCode(checkVerificationCodeDto);

    return { message: '전화번호 인증에 성공하였습니다.' };
  }
}
