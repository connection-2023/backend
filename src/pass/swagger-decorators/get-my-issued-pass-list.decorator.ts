import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiGetMyIssuedPassList() {
  return applyDecorators(
    ApiOperation({
      summary: '발급한 패스권 목록 조회',
      description: '발급한 패스권 목록 조회',
    }),
    ApiBearerAuth(),
    ApiOkResponse(
      SwaggerApiResponse.success('패스권 목록 반환', {
        statusCode: 200,
        data: {
          totalItemCount: 5,
          passList: [
            {
              id: 6,
              title: '하이패스 ㅋㅋ',
              price: 50000,
              availableMonths: 3,
              maxUsageCount: 10,
              salesCount: 6,
              lecturePassTarget: [
                {
                  lecture: {
                    id: 2,
                    title: '가비쌤과 함께하는 왁킹 클래스',
                  },
                },
              ],
            },
            {
              id: 5,
              title: '뭉툭한 패스',
              price: 117777,
              availableMonths: 3,
              maxUsageCount: 10,
              salesCount: 5,
              lecturePassTarget: [
                {
                  lecture: {
                    id: 2,
                    title: '가비쌤과 함께하는 왁킹 클래스',
                  },
                },
              ],
            },
            {
              id: 3,
              title: 'SON의 날카로운 패스',
              price: 55555,
              availableMonths: 3,
              maxUsageCount: 10,
              salesCount: 4,
              lecturePassTarget: [
                {
                  lecture: {
                    id: 2,
                    title: '가비쌤과 함께하는 왁킹 클래스',
                  },
                },
              ],
            },
            {
              id: 2,
              title: '페이커의 날카로운 패스',
              price: 50000,
              availableMonths: 3,
              maxUsageCount: 10,
              salesCount: 2,
              lecturePassTarget: [
                {
                  lecture: {
                    id: 2,
                    title: '가비쌤과 함께하는 왁킹 클래스',
                  },
                },
                {
                  lecture: {
                    id: 4,
                    title: '가리비쌤과 함께하는 클래스',
                  },
                },
              ],
            },
          ],
        },
      }),
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
