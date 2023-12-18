import { ApiProperty } from '@nestjs/swagger';
import { Reservation } from '@prisma/client';
import { LectureScheduleDto } from './lecture-schedule.dto';

export class ReservationDto implements Reservation {
  @ApiProperty({
    description: '예약 Id',
    type: Number,
  })
  id: number;
  userId: number;
  paymentId: number;
  lectureScheduleId: number;
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
    description: '일정',
    type: LectureScheduleDto,
  })
  lectureSchedule: LectureScheduleDto;

  constructor(reservation: Partial<ReservationDto>) {
    this.id = reservation.id;
    this.representative = reservation.representative;
    this.phoneNumber = reservation.phoneNumber;
    this.participants = reservation.participants;
    this.requests = reservation.requests;

    this.lectureSchedule = new LectureScheduleDto(reservation.lectureSchedule);

    Object.seal(this);
  }
}
