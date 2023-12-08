import { LectureCoupon } from '@prisma/client';
import { BaseReturnDto } from './base-return.dto';
import { LecturerDto } from './lecturer.dto';
import { LectureCouponTargetDto } from './lecture-coupon-target.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LectureCouponDto extends BaseReturnDto implements LectureCoupon {
  @ApiProperty({
    description: '쿠폰 id',
    type: Number,
  })
  id: number;
  lecturerId: number;

  @ApiProperty({
    description: '쿠폰 이름',
    type: Number,
  })
  title: string;

  @ApiProperty({
    description: '할인율',
    type: Number,
  })
  percentage: number;

  @ApiProperty({
    description: '할인 금액',
    type: Number,
  })
  discountPrice: number;

  @ApiProperty({
    description: '최대 할인 가능 금액',
    type: Number,
  })
  maxDiscountPrice: number;

  @ApiProperty({
    description: '최대 배포 수량',
    type: Number,
  })
  maxUsageCount: number;

  @ApiProperty({
    description: '현재까지 배포받은 수량',
    type: Number,
  })
  usageCount: number;
  isDisabled: boolean;

  @ApiProperty({
    description: '중복 쿠폰 여부',
    type: Boolean,
  })
  isStackable: boolean;

  @ApiProperty({
    description: '공개 여부',
    type: Boolean,
  })
  isPrivate: boolean;

  @ApiProperty({
    description: '시작일',
    type: Date,
  })
  startAt: Date;

  @ApiProperty({
    description: '종료일',
    type: Date,
  })
  endAt: Date;

  @ApiProperty({
    description: '생성일',
    type: Date,
  })
  createdAt: Date;

  deletedAt: Date;

  @ApiProperty({
    description: '강사 정보',
    type: LecturerDto,
  })
  lecturer?: LecturerDto;

  @ApiProperty({
    description: '쿠폰 적용 대상 목록',
    type: LectureCouponTargetDto,
    isArray: true,
  })
  lectureCouponTarget?: LectureCouponTargetDto[];

  constructor(lectureCoupon: Partial<LectureCouponDto>) {
    super();
    this.id = lectureCoupon.id;
    this.title = lectureCoupon.title;
    this.percentage = lectureCoupon.percentage;
    this.discountPrice = lectureCoupon.discountPrice;
    this.maxDiscountPrice = lectureCoupon.maxDiscountPrice;
    this.maxUsageCount = lectureCoupon.maxUsageCount;
    this.usageCount = lectureCoupon.usageCount;
    this.isDisabled = lectureCoupon.isDisabled;
    this.isStackable = lectureCoupon.isStackable;
    this.isPrivate = lectureCoupon.isPrivate;
    this.startAt = lectureCoupon.startAt;
    this.endAt = lectureCoupon.endAt;
    this.createdAt;

    this.lecturer = lectureCoupon.lecturer
      ? new LecturerDto(lectureCoupon.lecturer)
      : undefined;

    this.lectureCouponTarget = lectureCoupon.lectureCouponTarget
      ? lectureCoupon.lectureCouponTarget.map((couponTarget) => {
          return new LectureCouponTargetDto(couponTarget);
        })
      : null;

    Object.seal(this);
  }
}
