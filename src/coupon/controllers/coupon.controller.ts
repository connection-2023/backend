import { Controller, Get, UseGuards } from '@nestjs/common';
import { CouponService } from '@src/coupon/services/coupon.service';
import { ApiTags } from '@nestjs/swagger';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { ApiGetMyCouponList } from '@src/coupon/swagger-decorators/get-my-coupon-list.decorator';

@ApiTags('쿠폰')
@Controller('coupons')
export class CouponController {
  constructor(private couponService: CouponService) {}

  @ApiGetMyCouponList()
  @Get('/user')
  @UseGuards(UserAccessTokenGuard)
  async getMyCouponList(@GetAuthorizedUser() AuthorizedData: ValidateResult) {
    const coupons = await this.couponService.getMyCouponList(
      AuthorizedData.user.id,
    );

    return { coupons };
  }
}
