import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiCreateUserImage() {
  return applyDecorators(
    ApiOperation({ summary: '유저 이미지 생성' }),
    ApiBearerAuth(),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          image: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    ApiOkResponse(
      SwaggerApiResponse.success('유저 이미지 생성 성공', {
        statusCode: 201,
        data: {
          newUserImage: {
            id: 8,
            userId: 1,
            imageUrl:
              'https://connection-bucket.s3.amazonaws.com/users/1697522751600_IMG_3776.png',
          },
        },
      }),
    ),
    ApiBadRequestResponse(
      SwaggerApiResponse.exception([
        {
          name: 'alreadyExistUserImage',
          example: { message: '이미 프로필 사진이 존재하는 유저입니다.' },
        },
      ]),
    ),
  );
}
