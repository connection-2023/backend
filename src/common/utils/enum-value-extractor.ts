import { BadRequestException, Type } from '@nestjs/common';

export const TransformEnumValue = (key: string, type: object): any => {
  const enumValue = type[key.toUpperCase() as keyof typeof type];
  if (enumValue === undefined) {
    throw new BadRequestException(`Invalid status: ${key}`);
  }

  return enumValue;
};
