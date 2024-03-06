import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { BasicPaymentDto } from './basic-payment.dto';
import { PaymentPassUsageDto } from '../payment-pass-usage.dto';
import { PaymentMethodDto } from '../payment-method.dto';
import { ReservationDto } from '@src/common/dtos/reservation.dto';
import { PaymentProductTypeDto } from '../payment-product-type.dto';
import { BasicPaymentLectureScheduleDto } from './basic-payment-lecture-schedule.dto';
import { BasicLectureDto } from '@src/common/dtos/basic-lecture.dto';

@Exclude()
class LecturePaymentWithPassUsageReservationsDto extends OmitType(
  ReservationDto,
  ['regularLectureStatus', 'lectureSchedule'],
) {
  @ApiProperty({
    type: BasicPaymentLectureScheduleDto,
    description: '강의 일정',
  })
  @Type(() => BasicPaymentLectureScheduleDto)
  @Expose()
  lectureSchedule: BasicPaymentLectureScheduleDto;

  @ApiProperty({
    type: BasicLectureDto,
    description: '강의 정보',
  })
  @Type(() => BasicLectureDto)
  @Expose()
  lecture: BasicLectureDto;
}

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
    type: LecturePaymentWithPassUsageReservationsDto,
    description: '예약 정보',
  })
  @Type(() => LecturePaymentWithPassUsageReservationsDto)
  @Expose()
  reservation: LecturePaymentWithPassUsageReservationsDto;

  constructor(
    lecturePaymentWithPassUsage: Partial<LecturePaymentWithPassUsageDto>,
  ) {
    super();
    Object.assign(this, lecturePaymentWithPassUsage);
  }
}
