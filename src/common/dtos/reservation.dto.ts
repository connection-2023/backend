import { ApiProperty } from '@nestjs/swagger';
import { Reservation } from '@prisma/client';
import { PaymentLectureScheduleDto } from '@src/payments/dtos/payment-lecture-schedule.dto';
import { PaymentRegularLectureStatusDto } from '@src/payments/dtos/payment-regular-lecture-status.dto';

export class ReservationDto implements Reservation {
  @ApiProperty({
    description: '예약 Id',
    type: Number,
  })
  id: number;
  userId: number;
  paymentId: number;
  lectureScheduleId: number;
  regularLectureStatusId: number;

  @ApiProperty({
    description: '예약자명',
  })
  representative: string;

  @ApiProperty({
    description: '예약자 전화 번호',
  })
  phoneNumber: string;

  @ApiProperty({
    description: '예약 인원',
  })
  participants: number;

  @ApiProperty({
    description: '요청 상황',
  })
  requests: string;

  isEnabled: boolean;

  @ApiProperty({
    description: '원데이 클래스 일정',
    type: PaymentLectureScheduleDto,
  })
  lectureSchedule?: PaymentLectureScheduleDto;

  @ApiProperty({
    description: '정기 클래스 일정',
    type: PaymentRegularLectureStatusDto,
  })
  regularLectureStatus?: PaymentRegularLectureStatusDto;

  constructor(reservation: Partial<ReservationDto>) {
    this.id = reservation.id;
    this.representative = reservation.representative;
    this.phoneNumber = reservation.phoneNumber;
    this.participants = reservation.participants;
    this.requests = reservation.requests;

    this.lectureSchedule = reservation.lectureSchedule
      ? new PaymentLectureScheduleDto(reservation.lectureSchedule)
      : null;
    this.regularLectureStatus = reservation.regularLectureStatus
      ? new PaymentRegularLectureStatusDto(reservation.regularLectureStatus)
      : null;

    Object.seal(this);
  }
}
