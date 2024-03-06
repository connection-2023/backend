import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

interface IDate {
  startDate: string;
  endDate: string;
}

export function IsEndDateAfterStartDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEndDateAfterStartDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const { startDate, endDate } = args.object as IDate;
          const convertedStartDate = new Date(startDate);
          const convertedEndDate = new Date(endDate);

          return convertedStartDate < convertedEndDate;
        },

        defaultMessage(args: ValidationArguments) {
          const { startDate, endDate } = args.object as IDate;

          return `endDate(${endDate}) should be after startDate(${startDate})`;
        },
      },
    });
  };
}
