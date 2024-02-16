import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { EnrollSimpleLectureDto } from './enroll-simple-lecture.dto';
import { LecturerDto } from '@src/common/dtos/lecturer.dto';
import { LectureScheduleDto } from '@src/common/dtos/lecture-schedule.dto';
import { RegularLectureStatusDto } from '@src/common/dtos/regular-lecture-status.dto';
import { RegularLectureScheduleDto } from '@src/common/dtos/regular-lecture-schedule.dto';

@Exclude()
export class EnrollLectureListDto {
  @Expose()
  @ApiProperty({ description: '예약 id', type: Number })
  id: number;

  @Expose()
  @ApiProperty({ description: '강의 정보', type: EnrollSimpleLectureDto })
  lecture?: EnrollSimpleLectureDto;

  @Expose()
  @ApiProperty({ description: '강사 프로필', type: LecturerDto })
  lecturer?: LecturerDto;

  @Expose()
  @ApiProperty({ description: '클래스 일정', type: Date, isArray: true })
  schedules?: Date[];

  regularLectureStatus?: RegularLectureStatusDto;
  lectureSchedule?: LectureScheduleDto;

  constructor(enrollLecture: EnrollLectureListDto) {
    Object.assign(this, enrollLecture);
    this.lecture = new EnrollSimpleLectureDto(enrollLecture.lecture);
    this.lecturer = new LecturerDto(enrollLecture.lecture.lecturer);
    this.schedules = enrollLecture.regularLectureStatus
      ? enrollLecture.regularLectureStatus.regularLectureSchedule.map(
          (schedule) => schedule.startDateTime,
        )
      : [enrollLecture.lectureSchedule.startDateTime];
  }
}
