import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Length, Matches } from 'class-validator';

export class CheckVerificationCodeDto {
  @Matches(/^010\d{8}$/, { message: '유효하지 않은 전화번호 형식입니다.' })
  @IsNotEmpty()
  userPhoneNumber: string;

  @Matches(/^\d{6}$/, { message: '유효하지 않은 인증번호 형식입니다.' })
  @IsNotEmpty()
  verificationCode: string;
}
