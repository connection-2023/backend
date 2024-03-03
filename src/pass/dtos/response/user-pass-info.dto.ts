import { Exclude, Expose, Type } from 'class-transformer';
import { PassReservationDto } from './pass-history.dto';
import { UserPassDto } from '@src/common/dtos/user-pass.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

@Exclude()
export class UserPassInfoDto extends OmitType(UserPassDto, ['lecturePass']) {
  @ApiProperty({
    type: [PassReservationDto],
    description: '패스권 사용 내역',
  })
  @Type(() => PassReservationDto)
  @Expose()
  reservation: PassReservationDto[];
}
