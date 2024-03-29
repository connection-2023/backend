import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
import { ApiGetCouponListByLectureId } from '@src/coupon/swagger-decorators/get-applicable-coupons-for-lecture.decorator';
import { ApiGetPrivateLectureCouponCode } from '@src/coupon/swagger-decorators/get-private-lecture-coupon-code.decorator';
import { CreateLectureCouponDto } from '@src/coupon/dtos/create-lecture-coupon.dto';
import { ApiIssuePrivateCouponToUser } from '@src/coupon/swagger-decorators/issue-private-coupon-to-user.decorator';
import { GetMyCouponListDto } from '@src/coupon/dtos/get-my-coupon-list.dto';
import { GetMyIssuedCouponListDto } from '@src/coupon/dtos/get-my-issued-coupon-list.dto';
import { UpdateCouponDto } from '@src/coupon/dtos/update-coupon.dto';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { LectureCouponDto } from '@src/common/dtos/lecture-coupon.dto';
import { ApiUpdateLectureCoupon } from '@src/coupon/swagger-decorators/update-lecture-coupon.decorator';
import { AccessTokenGuard } from '@src/common/guards/access-token.guard';
import { ApiDeleteLectureCoupon } from '@src/coupon/swagger-decorators/delete-coupon.decorator';
import { AllowUserAndGuestGuard } from '@src/common/guards/allow-user-guest.guard';
import { ApplicableCouponDto } from '@src/coupon/dtos/applicable-coupon.dto';
import { IssuePublicCouponToUserDto } from '@src/coupon/dtos/issue-public-coupons-to-user.dto';

@ApiTags('쿠폰')
@Controller('coupons')
export class CouponController {
  constructor(private couponService: CouponService) {}

  @ApiGetCouponListByLectureId()
  @SetResponseKey('couponList')
  @UseGuards(AllowUserAndGuestGuard)
  @Get('/lectures/:lectureId')
  async getCouponListByLectureId(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('lectureId', ParseIntPipe) lectureId: number,
  ): Promise<ApplicableCouponDto[]> {
    const userId = authorizedData?.user?.id;

    return await this.couponService.getCouponListByLectureId(lectureId, userId);
  }

  @ApiUpdateLectureCoupon()
  @Patch('/:couponId')
  @SetResponseKey('updatedCoupon')
  @UseGuards(LecturerAccessTokenGuard)
  async updateCoupon(
    @GetAuthorizedUser() AuthorizedData: ValidateResult,
    @Param('couponId', ParseIntPipe) couponId: number,
    @Body() updateCouponDto: UpdateCouponDto,
  ): Promise<LectureCouponDto> {
    return await this.couponService.updateLectureCoupon(
      AuthorizedData.lecturer.id,
      couponId,
      updateCouponDto,
    );
  }

  @ApiDeleteLectureCoupon()
  @Delete('/:couponId')
  @UseGuards(AccessTokenGuard)
  async deleteCoupon(
    @GetAuthorizedUser() { user, lecturer }: ValidateResult,
    @Param('couponId', ParseIntPipe) couponId: number,
  ) {
    if (user) {
      await this.couponService.deleteUserCoupon(user.id, couponId);
    }

    if (lecturer) {
      await this.couponService.deleteLectureCoupon(lecturer.id, couponId);
    }
  }

  @ApiGetMyCouponList()
  @Get('/user')
  @UseGuards(UserAccessTokenGuard)
  async getMyCouponList(
    @GetAuthorizedUser() AuthorizedData: ValidateResult,
    @Query() getMyCouponListDto: GetMyCouponListDto,
  ) {
    return await this.couponService.getMyCouponList(
      AuthorizedData.user.id,
      getMyCouponListDto,
    );
  }

  @ApiGetMyIssuedCouponList()
  @Get('/lecturer')
  @UseGuards(LecturerAccessTokenGuard)
  async getMyIssuedCouponList(
    @GetAuthorizedUser() AuthorizedData: ValidateResult,
    @Query() getMyIssuedCouponListDto: GetMyIssuedCouponListDto,
  ) {
    return await this.couponService.getMyIssuedCouponList(
      AuthorizedData.lecturer.id,
      getMyIssuedCouponListDto,
    );
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
  @Post('/public/user')
  @UseGuards(UserAccessTokenGuard)
  async issuePublicCouponToUser(
    @Body() issuePublicCouponToUserDto: IssuePublicCouponToUserDto,
    @GetAuthorizedUser() AuthorizedData: ValidateResult,
  ): Promise<void> {
    await this.couponService.issuePublicCouponToUser(
      AuthorizedData.user.id,
      issuePublicCouponToUserDto,
    );
  }
}
