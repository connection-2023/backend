import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PhoneNumberDto } from '../dtos/phone-number.dto';
import { CheckVerificationCodeDto } from '../dtos/check-verification-code.dto';
import { AuthService } from '../services/auth.service';
import { Token } from 'src/common/interface/common-interface';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { GetAuthorizedUser } from 'src/common/decorator/get-user.decorator';
import { Users } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //토큰 생성을 위한 임시 url
  @Get('/token/:userId')
  async getAccessToken(@Param('userId') userId: number): Promise<Token> {
    const token: Token = await this.authService.generateToken({ userId });

    return token;
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
