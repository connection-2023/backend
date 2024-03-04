import { ApiProperty } from '@nestjs/swagger';
import { RegularLectureSchedule, RegularLectureStatus } from '@prisma/client';
import { SimpleLectureDto } from '@src/lecturer/dtos/simple-lecture.dto';
import { RegularLectureStatusWithLectureDto } from './regular-lecture-status-with-lecture.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RegularLectureScheduleDto implements RegularLectureSchedule {
  @Expose()
  @ApiProperty({
    description: '일정 id',
    type: Number,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: '요일',
    type: Number,
  })
  day: number;

  regularLectureStatusId: number;

  @Expose()
  @ApiProperty({
    description: '시작 시간',
    type: Date,
  })
  startDateTime: Date;

  @Expose()
  @ApiProperty({
    description: '종료 시간',
    type: Date,
  })
  endDateTime: Date;

  regularLectureStatus?: RegularLectureStatusWithLectureDto;

  constructor(regularLectureSchedule: Partial<RegularLectureScheduleDto>) {
    Object.assign(this, regularLectureSchedule);
  }
}
