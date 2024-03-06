import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { EnrollSimpleLectureDto } from './enroll-simple-lecture.dto';
import { LecturerDto } from '@src/common/dtos/lecturer.dto';
import { LectureScheduleWithLectureDto } from '@src/common/dtos/lecture-schedule-with-lecture.dto';
import { RegularLectureStatusWithLectureDto } from '@src/common/dtos/regular-lecture-status-with-lecture.dto';
import { RegularLectureScheduleDto } from '@src/common/dtos/regular-lecture-schedule.dto';

@Exclude()
export class EnrollLectureListDto {
  @Expose()
  @ApiProperty({ description: '예약 id', type: Number })
  id: number;

  @Expose()
  @ApiProperty({ description: '강의 정보', type: EnrollSimpleLectureDto })
  @Type(() => EnrollSimpleLectureDto)
  lecture?: EnrollSimpleLectureDto;

  @Expose()
  @ApiProperty({ description: '강사 프로필', type: LecturerDto })
  lecturer?: LecturerDto;

  @Expose()
  @ApiProperty({
    description: '정기 스케쥴',
    type: [RegularLectureScheduleDto],
  })
  regularLectureSchedule?: RegularLectureScheduleDto[];

  regularLectureStatus?: RegularLectureStatusWithLectureDto;

  @Expose()
  @ApiProperty({
    description: '원데이 스케쥴',
    type: LectureScheduleWithLectureDto,
  })
  lectureSchedule?: LectureScheduleWithLectureDto;

  constructor(enrollLecture: EnrollLectureListDto) {
    Object.assign(this, enrollLecture);
    this.regularLectureSchedule = enrollLecture.regularLectureStatus
      ? enrollLecture.regularLectureStatus.regularLectureSchedule.map(
          (schedule) => new RegularLectureScheduleDto(schedule),
        )
      : undefined;

    this.lectureSchedule = enrollLecture.lectureSchedule
      ? delete enrollLecture.lectureSchedule.lecture &&
        new LectureScheduleWithLectureDto(enrollLecture.lectureSchedule)
      : undefined;

    this.lecturer = new LecturerDto(enrollLecture.lecture.lecturer);
  }
}
