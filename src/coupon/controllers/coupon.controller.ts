import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CouponService } from '@src/coupon/services/coupon.service';
import { CreateLectureCouponDto } from '@src/coupon/dtos/create-lecture-coupon.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiCreateLectureCoupon } from '@src/coupon/swagger-decorators/create-lecture-coupon.decorator';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { UpdateCouponTargetDto } from '@src/coupon/dtos/update-coupon-target.dto';
import { ApiApplyLectureCoupon } from '@src/coupon/swagger-decorators/apply-lecture-coupon.decorator';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { ApiGetLectureCoupon } from '@src/coupon/swagger-decorators/get-lecture-coupon.decorator';

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
  }

  @ApiApplyLectureCoupon()
  @Post('/lectures/:couponId')
  @UseGuards(LecturerAccessTokenGuard)
  async applyLectureCoupon(
    @GetAuthorizedUser() AuthorizedData: ValidateResult,
    @Param('couponId', ParseIntPipe) couponId: number,
    @Body() updateCouponTarget: UpdateCouponTargetDto,
  ) {
    await this.couponService.applyLectureCoupon(
      AuthorizedData.lecturer.id,
      couponId,
      updateCouponTarget,
    );
  }

  @ApiGetLectureCoupon()
  @Post('/lectures/:couponId/user')
  @UseGuards(UserAccessTokenGuard)
  async getLectureCoupon(
    @Param('couponId', ParseIntPipe) couponId: number,
    @GetAuthorizedUser() AuthorizedData: ValidateResult,
  ) {
    await this.couponService.getLectureCoupon(AuthorizedData.user.id, couponId);
  }
}
