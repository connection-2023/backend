import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

function isEitherDiscountPriceOrPercentageFilled(
  value: any,
  args: ValidationArguments,
): boolean {
  const dto: CreateLectureCouponDto = args.object as CreateLectureCouponDto;
  const discountPrice = dto.discountPrice;
  const percentage = dto.percentage;

  return (
    (discountPrice !== null && discountPrice !== undefined) !==
    (percentage !== null && percentage !== undefined)
  );
}

export function IsEitherDiscountPriceOrPercentageFilled(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEitherDiscountPriceOrPercentageFilled',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate: isEitherDiscountPriceOrPercentageFilled,
      },
    });
  };
}

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
    example: '2023-01-19',
    description: '쿠폰 적용 시작 날짜',
    required: true,
  })
  @IsNotEmpty()
  @Type(() => Date)
  startAt: Date;

  @ApiProperty({
    example: '2024-01-19',
    description: '쿠폰 적용 종료 날짜',
    required: true,
  })
  @IsNotEmpty()
  @Type(() => Date)
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
    example: [1, 2],
    description: '강의 Id',
    required: false,
  })
  @IsOptional()
  lectureIds: number[];
}
