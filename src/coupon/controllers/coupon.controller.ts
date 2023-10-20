import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CouponService } from '../services/coupon.service';
import { CreateLectureCouponDto } from '../dtos/create-lecture-coupon.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiCreateLectureCoupon } from '../swagger-decorators/create-lecture-coupon.decorator';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { Lecturer } from '@prisma/client';
import { ValidateResult } from '@src/common/interface/common-interface';

@ApiTags('쿠폰')
@Controller('/coupons')
export class CouponController {
  constructor(private couponService: CouponService) {}

  @ApiCreateLectureCoupon()
  @Post()
  @UseGuards(LecturerAccessTokenGuard)
  async createLectureCoupon(
    @GetAuthorizedUser() AuthorizedData: ValidateResult,
    @Body() createLectureCouponDto: CreateLectureCouponDto,
  ) {
    await this.couponService.createLectureCoupon(
      AuthorizedData.lecturer.id,
      createLectureCouponDto,
    );

    return { message: '쿠폰 생성 완료' };
  }
}
