import { ApiProperty } from '@nestjs/swagger';
import { LectureHoliday } from '@prisma/client';
import { LectureDayDto } from '@src/common/dtos/lecture-day-schedule.dto';
import { LectureScheduleDto } from '@src/common/dtos/lecture-schedule.dto';
import { RegularLectureStatusDto } from '@src/common/dtos/regular-lecture-status.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CombinedScheduleDto {
  @Expose()
  @ApiProperty({
    description: '정기 클래스 스케쥴',
    type: [RegularLectureStatusDto],
  })
  regularLectureStatus: RegularLectureStatusDto[];

  @Expose()
  @ApiProperty({ description: '원데이 스케쥴', type: [LectureScheduleDto] })
  schedules: LectureScheduleDto[];

  @Expose()
  @ApiProperty({ description: '원데이 특정 요일', type: [LectureDayDto] })
  daySchedules: LectureDayDto[];

  @Expose()
  @ApiProperty({ description: 'holiday', type: [Date] })
  holidays?: Date[];

  constructor(
    lectureSchedule?: LectureScheduleDto[],
    lectureDay?: LectureDayDto[],
    regularSchedule?: RegularLectureStatusDto[],
    lectureHoliday?: LectureHoliday[],
  ) {
    Object.assign(this);

    this.regularLectureStatus = regularSchedule
      ? regularSchedule.map((schedule) => new RegularLectureStatusDto(schedule))
      : undefined;

    this.schedules = lectureSchedule
      ? lectureSchedule.map((schedule) => new LectureScheduleDto(schedule))
      : undefined;

    this.daySchedules = lectureDay
      ? lectureDay.map((day) => new LectureDayDto(day))
      : undefined;

    this.holidays = lectureHoliday
      ? lectureHoliday.map((holiday) => holiday.holiday)
      : undefined;
  }
}
