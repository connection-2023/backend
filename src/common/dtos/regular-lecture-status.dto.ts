import { ApiProperty } from '@nestjs/swagger';
import { RegularLectureStatus } from '@prisma/client';
import { RegularLectureScheduleDto } from './regular-lecture-schedule.dto';
import { Exclude, Expose, Type } from 'class-transformer';
@Exclude()
export class RegularLectureStatusDto implements RegularLectureStatus {
  @ApiProperty({
    type: Number,
    description: '일정 id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    type: [String],
    example: ['월', '화'],
    description: '수업 일정 요일',
  })
  @Expose()
  day: string[];

  @ApiProperty({
    description: '수업 시간',
  })
  @Expose()
  dateTime: string;

  @ApiProperty({
    type: Number,
    description: '현재 인원',
  })
  @Expose()
  numberOfParticipants: number;

  @ApiProperty({
    type: [RegularLectureScheduleDto],
    description: '강의 일정',
  })
  @Expose()
  @Type(() => RegularLectureScheduleDto)
  regularLectureSchedule: RegularLectureScheduleDto[];

  lectureId: number;

  constructor(lectureSchedule: Partial<RegularLectureStatusDto>) {
    Object.assign(this, lectureSchedule);
  }
}
