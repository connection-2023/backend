import { Controller, Post, Query } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/SMS')
  async sendSMS(@Query() phoneNumber: number) {
    await this.authService.sendSMS(phoneNumber);
    return { message: '인증번호가 발송 되었습니다.' };
  }
}
