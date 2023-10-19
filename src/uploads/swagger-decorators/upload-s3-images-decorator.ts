import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiUploadS3Images() {
  return applyDecorators(
    ApiOperation({
      summary: '다중 이미지 업로드',
      description: '다중 이미지 업로드',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          images: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    }),
    ApiCreatedResponse(
      SwaggerApiResponse.success('업로드된 이미지의 url 배열 반환', {
        statusCode: 201,
        data: {
          imageUrls: [
            'https://connection-bucket.s3.amazonaws.com/lecturer/1697608449287_1.png',
            'https://connection-bucket.s3.amazonaws.com/lecturer/1697608449324_2.jpg',
            'https://connection-bucket.s3.amazonaws.com/lecturer/1697608449326_3.png',
          ],
        },
      }),
    ),
  );
}
