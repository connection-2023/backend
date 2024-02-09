import { PickType } from '@nestjs/swagger';
import { GetLecturerPaymentListDto } from './get-lecturer-payment-list.dto';

export class GetTotalRevenueDto extends PickType(GetLecturerPaymentListDto, [
  'startDate',
  'endDate',
  'productType',
  'lectureId',
] as const) {}
