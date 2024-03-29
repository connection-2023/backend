import { ApiProperty } from '@nestjs/swagger';
import { Type, Expose, Exclude } from 'class-transformer';
import { Reservation } from '@prisma/client';
import { RegularLectureStatusDto } from './regular-lecture-status.dto';
import { LectureScheduleDto } from './lecture-schedule.dto';

@Exclude()
export class BasicReservationDto implements Reservation {
  @ApiProperty({
    description: '예약 Id',
    type: Number,
  })
  @Expose()
  id: number;

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

  @ApiProperty({
    type: RegularLectureStatusDto,
    description: '정기 클래스 일정',
  })
  @Type(() => RegularLectureStatusDto)
  @Expose()
  regularLectureStatus?: RegularLectureStatusDto;

  @ApiProperty({
    type: LectureScheduleDto,
    description: '원데이 클래스 일정',
  })
  @Type(() => LectureScheduleDto)
  @Expose()
  lectureSchedule?: LectureScheduleDto;

  isEnabled: boolean;

  userId: number;
  paymentId: number;
  lectureScheduleId: number;
  lectureId: number;
  regularLectureStatusId: number;
}
