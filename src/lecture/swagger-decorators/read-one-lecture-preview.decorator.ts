import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { SwaggerApiResponse } from '@src/common/swagger/swagger-response';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { LecturePreviewDto } from '../dtos/read-lecture-preview.dto';

export function ApiReadOneLecturePreview() {
  return applyDecorators(
    ApiOperation({
      summary: '강의 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'lecturePreview',
      LecturePreviewDto,
    ),
  );
}
