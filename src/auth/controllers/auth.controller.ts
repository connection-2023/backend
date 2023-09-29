import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PhoneNumberDto } from '@src/auth/dtos/phone-number.dto';
import { CheckVerificationCodeDto } from '@src/auth/dtos/check-verification-code.dto';
import { AuthService } from '@src/auth/services/auth.service';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { Users } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
