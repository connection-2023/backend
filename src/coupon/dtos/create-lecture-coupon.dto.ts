import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { IsEitherDiscountPriceOrPercentageFilled } from '../decorator/coupon.decorator';
import { IsFutureDate } from '@src/common/validator/custom-validator';

export class CreateLectureCouponDto {
  @ApiProperty({
    example: '지금까지 이런 쿠폰은 없었다.',
    description: '쿠폰 이름',
    required: true,
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 10, description: '할인률', required: false })
  @IsOptional()
  percentage: number;

  @ApiProperty({ example: 1000, description: '할인 금액', required: false })
  @IsOptional()
  discountPrice: number;

  @IsEitherDiscountPriceOrPercentageFilled({
    message: '할인률, 할인 금액 중 반드시 하나를 선택해야합니다.',
  })
  readonly validatePercentageAndDiscountPrice: string;

  @ApiProperty({
    example: 1000,
    description: '최대 할인 가능 금액',
    required: false,
  })
  @IsOptional()
  maxDiscountPrice: number;

  @ApiProperty({
    example: 100,
    description: '쿠폰 사용가능 갯수',
    required: false,
  })
  @IsOptional()
  maxUsageCount: number;

  //진행 기간
  @ApiProperty({
    example: 'Tue Oct 03 2023 20:00:00 GMT+0900 (Korean Standard Time)',
    description: '쿠폰 적용 시작 날짜',
    required: true,
  })
  @IsNotEmpty()
  @Type(() => Date)
  startAt: Date;

  @ApiProperty({
    example: 'Tue Oct 03 2023 20:00:00 GMT+0900 (Korean Standard Time)',
    description: '쿠폰 적용 종료 날짜',
    required: true,
  })
  @IsFutureDate({ message: 'endAt은 현재 시간보다 작을 수 없습니다.' })
  @Type(() => Date)
  @IsNotEmpty()
  endAt: Date;

  @ApiProperty({
    example: true,
    description: '쿠폰 중복적용 가능 여부',
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isStackable: boolean;

  @ApiProperty({
    example: true,
    description: '쿠폰 비활성화 여부',
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isPrivate: boolean;

  @ApiProperty({
    example: [1, 2],
    description: '강의 Id/ 생략 가능',
    required: false,
  })
  @IsOptional()
  lectureIds: number[];
}
