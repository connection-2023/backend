import { ApiProperty } from '@nestjs/swagger';
import { Reservation } from '@prisma/client';
import { LegacyPaymentLectureScheduleWithLectureDto } from '@src/payments/dtos/legacy-payment-lecture-schedule.dto';
import { PaymentRegularLectureStatusDto } from '@src/payments/dtos/payment-regular-lecture-status.dto';
import { LegacyPaymentDto } from '@src/payments/dtos/legacy-payment.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class LegacyReservationDto implements Reservation {
  @ApiProperty({
    description: '예약 Id',
    type: Number,
  })
  @Expose()
  id: number;

  userId: number;
  paymentId: number;
  lectureScheduleId: number;
  lectureId: number;
  regularLectureStatusId: number;

  @ApiProperty({
    description: '예약자명',
  })
  @Expose()
  representative: string;

  @ApiProperty({
    description: '예약자 전화 번호',
  })
  @Expose()
  phoneNumber: string;

  @ApiProperty({
    description: '예약 인원',
  })
  @Expose()
  participants: number;

  @ApiProperty({
    description: '요청 상황',
  })
  @Expose()
  requests: string;

  isEnabled: boolean;

  @ApiProperty({
    description: '원데이 클래스 일정',
    type: LegacyPaymentLectureScheduleWithLectureDto,
  })
  @Type(() => LegacyPaymentLectureScheduleWithLectureDto)
  @Expose()
  lectureSchedule?: LegacyPaymentLectureScheduleWithLectureDto;

  @ApiProperty({
    description: '정기 클래스 일정',
    type: PaymentRegularLectureStatusDto,
  })
  @Type(() => PaymentRegularLectureStatusDto)
  @Expose()
  regularLectureStatus?: PaymentRegularLectureStatusDto;

  payment?: LegacyPaymentDto;

  constructor(reservation: Partial<LegacyReservationDto>) {
    Object.assign(this, reservation);
  }
}
