import { SetMetadata } from '@nestjs/common';
import { SET_RESPONSE_KEY } from '@src/common/symboles/response-symbol';

export const SetResponseKey = (key: string) => {
  return SetMetadata(SET_RESPONSE_KEY, key);
};
