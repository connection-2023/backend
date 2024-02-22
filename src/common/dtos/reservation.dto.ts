import { ApiProperty } from '@nestjs/swagger';
import { Reservation } from '@prisma/client';
import { PaymentLectureScheduleDto } from '@src/payments/dtos/payment-lecture-schedule.dto';
import { PaymentRegularLectureStatusDto } from '@src/payments/dtos/payment-regular-lecture-status.dto';
import { PaymentDto } from '@src/payments/dtos/payment.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ReservationDto implements Reservation {
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
    type: PaymentLectureScheduleDto,
  })
  @Expose()
  lectureSchedule?: PaymentLectureScheduleDto;

  @ApiProperty({
    description: '정기 클래스 일정',
    type: PaymentRegularLectureStatusDto,
  })
  @Expose()
  regularLectureStatus?: PaymentRegularLectureStatusDto;

  payment?: PaymentDto;

  constructor(reservation: Partial<ReservationDto> = {}) {
    Object.assign(this, reservation);

    this.lectureSchedule = reservation.lectureSchedule
      ? new PaymentLectureScheduleDto(reservation.lectureSchedule)
      : null;
    this.regularLectureStatus = reservation.regularLectureStatus
      ? new PaymentRegularLectureStatusDto(reservation.regularLectureStatus)
      : null;
  }
}
