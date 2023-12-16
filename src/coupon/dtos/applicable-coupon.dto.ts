import { LectureCouponDto } from '@src/common/dtos/lecture-coupon.dto';
import { object } from 'joi';

export class ApplicableCouponDto extends LectureCouponDto {
  isOwned: boolean;
  constructor(applicableCoupon: LectureCouponDto) {
    super(applicableCoupon);
    console.log(this);
    this.isOwned = true;
    Object.assign(this, applicableCoupon);
  }
}
