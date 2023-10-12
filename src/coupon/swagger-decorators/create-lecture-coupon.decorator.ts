import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiCreateLectureCoupon() {
  return applyDecorators(
    ApiOperation({
      summary: '강의 쿠폰 생성',
      description:
        '쿠폰 생성할 때 클래스 Id를 넘겨 생성 또는 생성 후 클래스 Id 적용 가능',
    }),
    ApiBearerAuth(),
    ApiCreatedResponse(
      SwaggerApiResponse.success('쿠폰 생성 완료', {
        message: '쿠폰 생성 완료',
      }),
    ),
    ApiBadRequestResponse(
      SwaggerApiResponse.exception([
        {
          name: 'InvalidClassIncluded',
          example: { message: '유효하지 않은 클래스가 포함되었습니다.' },
        },
        {
          name: 'InvalidLecturerInformation',
          example: { message: '유효하지 않는 강사 정보 요청입니다.' },
        },
      ]),
    ),
    ApiUnauthorizedResponse(
      SwaggerApiResponse.exception([
        {
          name: 'InvalidTokenFormat',
          example: { message: '잘못된 토큰 형식입니다.' },
        },
      ]),
    ),
  );
}
