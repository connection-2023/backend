import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CookiesTokenExtractor {
  constructor() {}

  static fromCookies = function () {
    return function (request) {
      let token = null;
      if (!request.cookies) {
        throw new NotFoundException(
          `토큰이 존재하지 않습니다. 다시 로그인해주세요.`,
        );
      }

      token = request.cookies['refreshToken'];

      return token;
    };
  };
}
