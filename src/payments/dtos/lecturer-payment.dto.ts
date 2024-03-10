import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '@src/common/dtos/user.dto';
import { LegacyPaymentDto } from './legacy-payment.dto';

//신청한 유저의 프로필을 포함한 Dto
export class LecturerPaymentDto extends LegacyPaymentDto {
  @ApiProperty({
    type: UserDto,
    description: '신청한 유저 프로필카드',
  })
  user: UserDto;

  constructor(lecturerPayment: Partial<LecturerPaymentDto>) {
    const { user, ...payment } = lecturerPayment;
    super(payment);
    Object.assign(this);

    this.user = new UserDto(user);
  }
}
