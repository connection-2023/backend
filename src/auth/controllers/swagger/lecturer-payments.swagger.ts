import { ApiOperator } from '@src/common/types/type';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ExceptionResponseDto } from '@src/common/swagger/dtos/exeption-response.dto';
import { PaginationResponseDto } from '@src/common/swagger/dtos/pagination-response.dto';
import { LecturerPaymentItemDto } from '@src/payments/dtos/response/lecturer-payment-item.dto';
import { AuthOAuthController } from '../auth-oauth.controller';

export const ApiOAuth: ApiOperator<keyof AuthOAuthController> = {
  SignIn: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      ApiBearerAuth(),
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'lecturerPaymentList',
        LecturerPaymentItemDto,
      ),
      ExceptionResponseDto.swaggerBuilder(HttpStatus.BAD_REQUEST, [
        {
          error: 'differentSignUpMethod',
          description: '다른 방식으로 가입된 이메일 입니다.',
        },
      ]),
      ExceptionResponseDto.swaggerBuilder(HttpStatus.INTERNAL_SERVER_ERROR, [
        {
          error: 'oAuthServerError',
          description: 'OAuth 서버 요청 중 오류가 발생했습니다.',
        },
      ]),
    );
  },
};
