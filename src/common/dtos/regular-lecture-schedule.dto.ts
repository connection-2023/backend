import { ApiProperty } from '@nestjs/swagger';
import { RegularLectureSchedule } from '@prisma/client';

export class RegularLectureScheduleDto implements RegularLectureSchedule {
  @ApiProperty({
    description: '일정 id',
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: '요일',
    type: Number,
  })
  day: number;

  regularLectureStatusId: number;

  @ApiProperty({
    description: '시작 시간',
    type: Date,
  })
  startDateTime: Date;

  @ApiProperty({
    description: '종료 시간',
    type: Date,
  })
  endDateTime: Date;

  constructor(regularLectureSchedule: Partial<RegularLectureScheduleDto>) {
    this.id = regularLectureSchedule.id;
    this.day = regularLectureSchedule.day;
    this.startDateTime = regularLectureSchedule.startDateTime;
    this.endDateTime = regularLectureSchedule.endDateTime;

    Object.seal(this);
  }
}
