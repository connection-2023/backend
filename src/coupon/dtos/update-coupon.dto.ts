import { ApiProperty } from '@nestjs/swagger';
import { IsEitherDiscountPriceOrPercentageFilled } from '../decorator/coupon.decorator';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { IsFutureDate } from '@src/common/validator/custom-validator';

export class UpdateCouponDto {
  @ApiProperty({
    description: '쿠폰 이름',
    required: true,
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: Number, description: '할인률', required: false })
  @IsOptional()
  percentage: number;

  @ApiProperty({ type: Number, description: '할인 금액', required: false })
  @IsOptional()
  discountPrice: number;

  @ApiProperty({
    type: Number,
    description: '최대 할인 가능 금액',
    required: false,
  })
  @IsOptional()
  maxDiscountPrice: number;

  @IsEitherDiscountPriceOrPercentageFilled()
  private readonly validatePercentageAndDiscountPrice: string;

  @ApiProperty({
    description: '쿠폰 사용가능 갯수',
    required: false,
  })
  @IsOptional()
  maxUsageCount: number;

  @ApiProperty({
    description: '쿠폰 적용 종료 날짜',
    required: true,
  })
  @IsFutureDate({ message: 'endAt은 현재 시간보다 작을 수 없습니다.' })
  @Type(() => Date)
  @IsNotEmpty()
  endAt: Date;

  @ApiProperty({
    description: '쿠폰 중복적용 가능 여부',
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isStackable: boolean;

  @ApiProperty({
    description: '쿠폰 비활성화 여부',
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isPrivate: boolean;

  @ApiProperty({
    description: '강의 Id/ 생략 가능',
    required: false,
    isArray: true,
    type: Number,
  })
  @IsOptional()
  lectureIds: number[];
}
