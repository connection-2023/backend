import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsNumber,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsNotBlank', async: false })
class IsNotBlankConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} should not be empty`;
  }
}

export function IsNotBlank() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [],
      options: {},
      validator: IsNotBlankConstraint,
    });
  };
}

export function IsNumberType(): PropertyDecorator {
  return applyDecorators(
    Type(() => Number),
    IsNumber(),
  );
}

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return (
            value instanceof Date && value.getTime() > new Date().getTime()
          );
        },
      },
    });
  };
}

//시간 중 HH:mm:ss 형태를 검증하기 위한 validator
@ValidatorConstraint({ name: 'isHMSTimeFormatArray', async: false })
class IsHourMinSecFormatConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!Array.isArray(value)) {
      return false;
    }

    const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

    return value.every(
      (time: string) => typeof time === 'string' && timeRegex.test(time),
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be an array of strings in the format HH:mm:ss`;
  }
}

export function IsHourMinSecFormat(options?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [],
      options,
      validator: IsHourMinSecFormatConstraint,
    });
  };
}
