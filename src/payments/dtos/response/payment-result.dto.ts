import { ApiProperty } from '@nestjs/swagger';
import { Type, Expose, Exclude, Transform } from 'class-transformer';
import { PaymentMethodDto } from '../payment-method.dto';
import { PaymentPassUsageDto } from '../payment-pass-usage.dto';
import { PaymentProductTypeDto } from '../payment-product-type.dto';
import { BasicPaymentDto } from './basic-payment.dto';
import { LecturePaymentWithPassUsageDto } from './lecture-payment-with-pass-usage.dto';
import { ReservationWithLectureDto } from '@src/common/dtos/reservation-with-lecture.dto';

@Exclude()
export class PaymentResultDto extends BasicPaymentDto {
  @ApiProperty({
    type: PaymentPassUsageDto,
    description: '패스권 사용 내역',
  })
  @Type(() => PaymentPassUsageDto)
  @Expose()
  paymentPassUsage: PaymentPassUsageDto;

  @ApiProperty({
    type: ReservationWithLectureDto,
    description: '예약 정보',
  })
  @Type(() => ReservationWithLectureDto)
  @Expose()
  reservation: ReservationWithLectureDto;

  constructor(
    lecturePaymentWithPassUsage: Partial<LecturePaymentWithPassUsageDto>,
  ) {
    super();
    Object.assign(this, lecturePaymentWithPassUsage);
  }
}
