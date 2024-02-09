import { BadRequestException, Type } from '@nestjs/common';
import { ExtractEnumKeys } from './enum-key-extractor';

export const TransformEnumValue = (
  value: string,
  type: object,
  key?: string,
): any => {
  const enumValue = type[value.toUpperCase() as keyof typeof type];
  if (enumValue === undefined) {
    throw new BadRequestException(
      key
        ? `${key} must be one of the following values: ${ExtractEnumKeys(type)}`
        : `one of the following values: ${ExtractEnumKeys(type)}`,
    );
  }

  return enumValue;
};
