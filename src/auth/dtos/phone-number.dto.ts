import { IsNotEmpty, Matches } from 'class-validator';

export class PhoneNumberDto {
  @Matches(/^010\d{8}$/, { message: '유효하지 않은 전화번호 형식입니다.' })
  @IsNotEmpty()
  userPhoneNumber: string;
}
