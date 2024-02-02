import { ApiProperty } from '@nestjs/swagger';
import { LectureScheduleDto } from '@src/common/dtos/lecture-schedule.dto';
import { RegularLectureScheduleDto } from '@src/common/dtos/regular-lecture-schedule.dto';
import { RegularLectureScheduleWithLectureDto } from './get-regular-schedule.dto';

export class EnrollLectureScheduleDto {
  @ApiProperty({
    description: '원데이 클래스 일정',
    type: LectureScheduleDto,
    isArray: true,
  })
  schedules?: LectureScheduleDto[];

  @ApiProperty({
    description: '정기 클래스 일정',
    type: RegularLectureScheduleWithLectureDto,
    isArray: true,
  })
  regularSchedules?: RegularLectureScheduleWithLectureDto[];

  constructor(
    schedulesResult: Partial<LectureScheduleDto[]>,
    regularSchedulesResult: Partial<RegularLectureScheduleWithLectureDto[]>,
  ) {
    this.schedules = schedulesResult[0]
      ? schedulesResult.map((schedule) => new LectureScheduleDto(schedule))
      : undefined;

    this.regularSchedules = regularSchedulesResult[0]
      ? regularSchedulesResult.map(
          (schedule) => new RegularLectureScheduleWithLectureDto(schedule),
        )
      : undefined;

    Object.assign(this);
  }
}
