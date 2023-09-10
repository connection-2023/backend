import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { PhoneNumberDto } from '../dtos/phone-number.dto';
import { CheckVerificationCodeDto } from '../dtos/check-verification-code.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //토큰 사용전까지 userId로 임시사용
  @Post('/SMS/:userId')
  async sendSMS(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() phoneNumberDto: PhoneNumberDto,
  ) {
    await this.authService.sendVerificationCode(
      userId,
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
