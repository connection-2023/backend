import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { LearnerPaymentOverviewDto } from '../dtos/learner-payment-overview.dto';

export function ApiGetLecturerLearnerPaymentsOverview() {
  return applyDecorators(
    ApiOperation({
      summary: '수강생의 신청한 클래스, 구매한 패스권 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'learnerPaymentsOverView',
      LearnerPaymentOverviewDto,
      { isArray: true },
    ),
  );
}
