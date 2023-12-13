import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { CreateLectureCouponDto } from '../dtos/create-lecture-coupon.dto';
import { BadRequestException } from '@nestjs/common';

function isEitherDiscountPriceOrPercentageFilled(
  value: any,
  args: ValidationArguments,
): boolean {
  const dto: CreateLectureCouponDto = args.object as CreateLectureCouponDto;
  const discountPrice = dto.discountPrice || null;
  const maxDiscountPrice = dto.maxDiscountPrice || null;
  const percentage = dto.percentage || null;

  if (!percentage && !discountPrice) {
    throw new BadRequestException(
      `할인률, 할인 금액 중 반드시 하나를 선택해야합니다.`,
      'NoValueProvided',
    );
  }
  if ((discountPrice && percentage) || (maxDiscountPrice && percentage)) {
    throw new BadRequestException(
      `할인 금액과 할인 비율은 동시에 설정할 수 없습니다.`,
      'BothValueProvided',
    );
  }

  if (maxDiscountPrice && maxDiscountPrice < discountPrice) {
    throw new BadRequestException(
      `최대할인 금액은 할인금액보다 낮을 수 없습니다.`,
      'InvalidMaxDiscountPrice',
    );
  }

  dto.percentage = percentage;
  dto.maxDiscountPrice = maxDiscountPrice;
  dto.discountPrice = discountPrice;

  return true;
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
