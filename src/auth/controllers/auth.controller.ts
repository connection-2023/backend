import { Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { PhoneNumberDto } from '../dtos/phone-number.dto';
import { CheckVerificationCodeDto } from '../dtos/check-verification-code.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/SMS')
  async sendSMS(@Query() phoneNumberDto: PhoneNumberDto) {
    await this.authService.sendSMS(phoneNumberDto);

    return { message: '인증번호가 발송 되었습니다.' };
  }

  @Get('/SMS')
  async checkVerificationCode(
    @Query() checkVerificationCodeDto: CheckVerificationCodeDto,
  ) {
    const result: Boolean = await this.authService.checkVerificationCode(
      checkVerificationCodeDto,
    );
    if (result) {
      return { message: '전화번호 인증에 성공하였습니다.' };
    }
  }
}
