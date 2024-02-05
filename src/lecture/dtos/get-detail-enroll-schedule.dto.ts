import { LectureWithDetailEnrollScheduleDto } from './get-lecture-with-detial-enroll-schedule.dto';
import { ApiProperty } from '@nestjs/swagger';
import { LectureNotificationDto } from '@src/common/dtos/lecture-notification.dto';
import { LectureScheduleDto } from '@src/common/dtos/lecture-schedule.dto';
import { LectureDto } from '@src/common/dtos/lecture.dto';
import { LecturerDto } from '@src/common/dtos/lecturer.dto';
import { RegularLectureScheduleDto } from '@src/common/dtos/regular-lecture-schedule.dto';
import { RegularLectureStatusDto } from '@src/common/dtos/regular-lecture-status.dto';
import { ReservationDto } from '@src/common/dtos/reservation.dto';
import { PaymentDto } from '@src/payments/dtos/payment.dto';
import { Exclude, Expose } from 'class-transformer';
import { scheduled } from 'rxjs';
import { EnrollScheduleDetailPriceDto } from './enroll-schedule-detail-price.dto';

@Exclude()
export class DetailEnrollScheduleDto {
  @Expose()
  @ApiProperty({
    description: '강의 정보',
    type: LectureWithDetailEnrollScheduleDto,
  })
  lecture?: LectureWithDetailEnrollScheduleDto;

  @Expose()
  @ApiProperty({ description: '강사', type: LecturerDto })
  lecturer?: LecturerDto;

  @Expose()
  @ApiProperty({ description: '원데이 수강 일정', type: LectureScheduleDto })
  lectureSchedule?: LectureScheduleDto;

  @Expose()
  @ApiProperty({
    description: '정기 수강 일정',
    type: RegularLectureScheduleDto,
    isArray: true,
  })
  regularLectureSchedule?: RegularLectureScheduleDto[];

  @Expose()
  @ApiProperty({ description: '대표자' })
  representative: string;

  @Expose()
  @ApiProperty({ description: '대표 연락처' })
  phoneNumber: string;

  @Expose()
  @ApiProperty({
    description: '결제 정보',
    type: EnrollScheduleDetailPriceDto,
  })
  payment?: EnrollScheduleDetailPriceDto;

  @Expose()
  @ApiProperty({ description: '수강생 요청사항' })
  request: string;

  regularLectureStatus?: RegularLectureStatusDto;

  constructor(reservation: Partial<ReservationDto>) {
    Object.assign(this, reservation);

    this.lecture = reservation.lectureSchedule
      ? new LectureWithDetailEnrollScheduleDto(
          reservation.lectureSchedule.lecture,
        )
      : new LectureWithDetailEnrollScheduleDto(
          reservation.regularLectureStatus.lecture,
        );

    this.lecturer = reservation.lectureSchedule
      ? new LecturerDto(reservation.lectureSchedule.lecture.lecturer)
      : new LecturerDto(reservation.regularLectureStatus.lecture.lecturer);

    this.lectureSchedule = reservation.lectureSchedule
      ? delete reservation.lectureSchedule.lecture &&
        new LectureScheduleDto(reservation.lectureSchedule)
      : undefined;
    this.regularLectureSchedule = reservation.regularLectureStatus
      ? reservation.regularLectureStatus.regularLectureSchedule.map(
          (schedule) => new RegularLectureScheduleDto(schedule),
        )
      : undefined;

    this.payment = new EnrollScheduleDetailPriceDto(reservation.payment);
  }
}
