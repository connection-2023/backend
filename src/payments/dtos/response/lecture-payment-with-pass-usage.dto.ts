import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { BasicPaymentDto } from './basic-payment.dto';
import { PaymentPassUsageDto } from '../payment-pass-usage.dto';
import { ReservationWithLectureDto } from '@src/common/dtos/reservation-with-lecture.dto';

@Exclude()
export class LecturePaymentWithPassUsageDto extends BasicPaymentDto {
  @ApiProperty({
    type: PaymentPassUsageDto,
    description: '패스권 사용 정보',
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
