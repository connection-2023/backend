import { ApiProperty } from '@nestjs/swagger';
import { LectureSchedule } from '@prisma/client';
import { SimpleLectureDto } from '@src/lecturer/dtos/simple-lecture.dto';
import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class LectureScheduleDto implements LectureSchedule {
  @ApiProperty({
    description: '일정 id',
    type: Number,
  })
  @Expose()
  id: number;

  lectureId: number;
  day: number;

  @ApiProperty({
    description: '시작 시간',
    type: Date,
  })
  @Expose()
  startDateTime: Date;

  @ApiProperty({
    description: '종료 시간',
    type: Date,
  })
  @Expose()
  endDateTime: Date;

  @ApiProperty({
    description: '현재 인원',
    type: Number,
  })
  @Expose()
  numberOfParticipants: number;

  constructor(lectureSchedule: Partial<LectureScheduleDto>) {
    Object.assign(this, lectureSchedule);
  }
}
