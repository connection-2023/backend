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
