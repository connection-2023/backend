import { ApiProperty } from '@nestjs/swagger';
import { LectureCouponDto } from '@src/common/dtos/lecture-coupon.dto';
import { object } from 'joi';

export class ApplicableCouponDto extends LectureCouponDto {
  @ApiProperty({
    description: '보유 여부',
    type: Boolean,
  })
  isOwned: boolean;

  constructor(applicableCoupon: Partial<LectureCouponDto>) {
    super(applicableCoupon);
  }
}
