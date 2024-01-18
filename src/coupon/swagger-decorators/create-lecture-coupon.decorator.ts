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
      SwaggerApiResponse.success('생성된 쿠폰 정보 반환', {
        statusCode: 201,
        data: {
          coupon: {
            id: 8,
            lecturerId: 1,
            title: '최최종 쿠폰',
            percentage: null,
            discountPrice: 5000,
            maxDiscountPrice: null,
            maxUsageCount: 100,
            usageCount: 0,
            isDisabled: false,
            isStackable: false,
            isPrivate: true,
            startAt: '2023-01-19T00:00:00.000Z',
            endAt: '2024-01-19T00:00:00.000Z',
            createdAt: '2023-11-22T13:55:42.580Z',
            updatedAt: '2023-11-22T13:55:42.580Z',
            deletedAt: null,
          },
        },
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
          example: { message: '유효하지 않은 강사 정보 요청입니다.' },
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
