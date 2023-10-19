import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';

export function ApiUploadS3Image() {
  return applyDecorators(
    ApiOperation({ summary: '단일 이미지 업로드' }),
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
    ApiCreatedResponse(
      SwaggerApiResponse.success('업로드된 이미지의 url 반환', {
        statusCode: 201,
        data: {
          imageUrl:
            'https://connection-bucket.s3.amazonaws.com/lecturer/1697609554800_2.jpg',
        },
      }),
    ),
  );
}
