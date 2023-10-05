import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

// 커스텀 데코레이터를 정의합니다.
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

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
        validate(value: any, args: ValidationArguments) {
          const dto: CreateLectureCouponDto =
            args.object as CreateLectureCouponDto;

          const discountPrice = dto.discountPrice;
          const percentage = dto.percentage;

          return (
            (discountPrice !== undefined && discountPrice !== null) ||
            (percentage !== undefined && percentage !== null)
          );
        },
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

  @ApiProperty({
    example: '두번 다시 없을 기회',
    description: '쿠폰 설명',
    required: false,
  })
  @IsOptional()
  description: string;

  @ApiProperty({ example: 10, description: '할인률', required: false })
  @IsOptional()
  percentage: number;

  @ApiProperty({ example: 1000, description: '할인 금액', required: false })
  @IsOptional()
  discountPrice: number;

  @IsEitherDiscountPriceOrPercentageFilled()
  readonly customValidation: string;

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
}
