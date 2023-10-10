import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiCreateLecturer() {
  return applyDecorators(
    ApiOperation({
      summary: '강사 생성',
      description: '강사 생성 후 강사로 전환 가능',
    }),
    ApiBearerAuth(),
    ApiCreatedResponse(
      SwaggerApiResponse.success(
        '강사 생성 완료, 강사 전환 요청 시 전환 가능',
        {
          message: '강사 생성 완료',
        },
      ),
    ),
    ApiBadRequestResponse(
      SwaggerApiResponse.exception([
        {
          name: 'InvalidUserInformation',
          example: { message: '유효하지 않는 유저 정보 요청입니다.' },
        },
        {
          name: 'lecturerAlreadyExists',
          example: { message: '이미 강사정보가 생성 되었습니다.' },
        },
        {
          name: 'InvalidAddress',
          example: { message: '유효하지 않은 주소입니다.' },
        },
        {
          name: 'InvalidAddressFormat',
          example: { message: '잘못된 주소형식입니다' },
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
