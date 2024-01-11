import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '@src/common/dtos/user.dto';
import { PaymentDto } from './payment.dto';

//신청한 유저의 프로필을 포함한 Dto
export class LecturerPaymentDto extends PaymentDto {
  @ApiProperty({
    type: UserDto,
    description: '신청한 유저 프로필카드',
  })
  user: UserDto;

  constructor(payment: Partial<LecturerPaymentDto>) {
    super(payment);
    this.user = new UserDto(payment.user);

    Object.assign(this);
  }
}
