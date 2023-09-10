import { IsNotEmpty, Matches } from 'class-validator';

export class PhoneNumberDto {
  @Matches(/^010\d{8}$/, { message: '유효한 전화번호 형식이 아닙니다.' })
  @IsNotEmpty()
  userPhoneNumber: string;
}
