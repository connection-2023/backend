import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CouponService } from '@src/coupon/services/coupon.service';
import { ApiTags } from '@nestjs/swagger';
import { ValidateResult } from '@src/common/interface/common-interface';
import { UserAccessTokenGuard } from '@src/common/guards/user-access-token.guard';
import { ApiGetMyCouponList } from '@src/coupon/swagger-decorators/get-my-coupon-list.decorator';
import { ApiGetMyIssuedCouponList } from '@src/coupon/swagger-decorators/get-my-issued-coupon-list.decorator';
import { ApiIssuePublicCouponToUser } from '@src/coupon/swagger-decorators/issue-public-coupon-to-user.decorator';
import { ApiCreateLectureCoupon } from '@src/coupon/swagger-decorators/create-lecture-coupon.decorator';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { UpdateCouponTargetDto } from '@src/coupon/dtos/update-coupon-target.dto';
import { ApiApplyLectureCoupon } from '@src/coupon/swagger-decorators/apply-lecture-coupon.decorator';
import { ApiGetApplicableCouponsForLecture } from '@src/coupon/swagger-decorators/get-applicable-coupons-for-lecture.decorator';
import { ApiGetPrivateLectureCouponCode } from '@src/coupon/swagger-decorators/get-private-lecture-coupon-code.decorator';
import { CreateLectureCouponDto } from '@src/coupon/dtos/create-lecture-coupon.dto';
import { ApiIssuePrivateCouponToUser } from '../swagger-decorators/issue-private-coupon-to-user.decorator';

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

  @ApiGetMyIssuedCouponList()
  @Get('/lecturer')
  @UseGuards(LecturerAccessTokenGuard)
  async getMyIssuedCouponList(
    @GetAuthorizedUser() AuthorizedData: ValidateResult,
  ) {
    const coupons = await this.couponService.getMyIssuedCouponList(
      AuthorizedData.lecturer.id,
    );

    return { coupons };
  }

  @ApiCreateLectureCoupon()
  @Post('/lecture')
  @UseGuards(LecturerAccessTokenGuard)
  async createLectureCoupon(
    @GetAuthorizedUser() AuthorizedData: ValidateResult,
    @Body() createLectureCouponDto: CreateLectureCouponDto,
  ) {
    const coupon = await this.couponService.createLectureCoupon(
      AuthorizedData.lecturer.id,
      createLectureCouponDto,
    );

    return { coupon };
  }

  @ApiGetApplicableCouponsForLecture()
  @Get('/lectures/:lectureId')
  async getApplicableCouponsForLecture(
    @Param('lectureId', ParseIntPipe) lectureId: number,
  ) {
    const applicableCoupons =
      await this.couponService.getApplicableCouponsForLecture(lectureId);

    return { applicableCoupons };
  }

  @ApiApplyLectureCoupon()
  @Post('/:couponId/target')
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

  @ApiGetPrivateLectureCouponCode()
  @Get('/private/:couponId')
  @UseGuards(LecturerAccessTokenGuard)
  async getPrivateLectureCouponCode(
    @GetAuthorizedUser() AuthorizedData: ValidateResult,
    @Param('couponId', ParseIntPipe) couponId: number,
  ) {
    const privateCouponCode: string =
      await this.couponService.getPrivateLectureCouponCode(
        AuthorizedData.lecturer.id,
        couponId,
      );

    return { privateCouponCode };
  }

  @ApiIssuePrivateCouponToUser()
  @UseGuards(UserAccessTokenGuard)
  @Post('/private/:couponCode/user')
  async issuePrivateCouponToUser(
    @GetAuthorizedUser() AuthorizedData: ValidateResult,
    @Param('couponCode') couponCode: string,
  ) {
    await this.couponService.issuePrivateCouponToUser(
      AuthorizedData.user.id,
      couponCode,
    );
  }

  @ApiIssuePublicCouponToUser()
  @Post('/public/:couponId/user')
  @UseGuards(UserAccessTokenGuard)
  async issuePublicCouponToUser(
    @Param('couponId', ParseIntPipe) couponId: number,
    @GetAuthorizedUser() AuthorizedData: ValidateResult,
  ) {
    await this.couponService.issuePublicCouponToUser(
      AuthorizedData.user.id,
      couponId,
    );
  }
}
