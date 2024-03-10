import { LectureWithDetailEnrollScheduleDto } from './get-lecture-with-detial-enroll-schedule.dto';
import { ApiProperty } from '@nestjs/swagger';
import { LectureScheduleWithLectureDto } from '@src/common/dtos/lecture-schedule-with-lecture.dto';
import { LecturerDto } from '@src/common/dtos/lecturer.dto';
import { RegularLectureScheduleDto } from '@src/common/dtos/regular-lecture-schedule.dto';
import { RegularLectureStatusWithLectureDto } from '@src/common/dtos/regular-lecture-status-with-lecture.dto';
import { LegacyReservationDto } from '@src/common/dtos/legacy-reservation.dto';
import { Exclude, Expose, Type } from 'class-transformer';
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
  @ApiProperty({
    description: '원데이 수강 일정',
    type: LectureScheduleWithLectureDto,
  })
  lectureSchedule?: LectureScheduleWithLectureDto;

  @Expose()
  @ApiProperty({
    description: '정기 수강 일정',
    type: [RegularLectureScheduleDto],
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
  @Type(() => EnrollScheduleDetailPriceDto)
  payment?: EnrollScheduleDetailPriceDto;

  @Expose()
  @ApiProperty({ description: '수강생 요청사항' })
  request: string;

  @Expose()
  @ApiProperty({ description: '완료 여부', type: Boolean })
  isCompleted: boolean;

  @Expose()
  @ApiProperty({ description: '신청 인원', type: Number })
  @Type(() => Number)
  participants: number;

  regularLectureStatus?: RegularLectureStatusWithLectureDto;

  constructor(reservation: Partial<LegacyReservationDto>) {
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
        new LectureScheduleWithLectureDto(reservation.lectureSchedule)
      : undefined;

    this.regularLectureSchedule = reservation.regularLectureStatus
      ? reservation.regularLectureStatus.regularLectureSchedule.map(
          (schedule) => new RegularLectureScheduleDto(schedule),
        )
      : undefined;

    const currentTime = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);

    this.isCompleted = true;

    if (this.lectureSchedule) {
      const startDateTime = new Date(this.lectureSchedule.startDateTime);

      if (startDateTime > currentTime) {
        this.isCompleted = false;
      }
    } else {
      this.regularLectureSchedule.forEach((schedule) => {
        const startDateTime = new Date(schedule.startDateTime);

        if (startDateTime > currentTime) {
          this.isCompleted = false;
          return;
        }
      });
    }
  }
}
