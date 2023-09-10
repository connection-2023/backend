import { Controller, Post, Query } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { PhoneNumberDto } from '../dtos/phone-number.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/SMS')
  async sendSMS(@Query() phoneNumberDto: PhoneNumberDto) {
    await this.authService.sendSMS(phoneNumberDto);

    return { message: '인증번호가 발송 되었습니다.' };
  }
}
