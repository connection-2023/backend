import { ApiProperty } from '@nestjs/swagger';
import { LectureSchedule } from '@prisma/client';
import { SimpleLectureDto } from '@src/lecturer/dtos/simple-lecture.dto';

export class LectureScheduleDto implements LectureSchedule {
  @ApiProperty({
    description: '일정 id',
    type: Number,
  })
  id: number;
  lectureId: number;
  day: number;

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

  @ApiProperty({
    description: '현재 인원',
    type: Number,
  })
  numberOfParticipants: number;

  @ApiProperty({
    description: '강의 정보',
    type: SimpleLectureDto,
  })
  lecture?: SimpleLectureDto;

  constructor(lectureSchedule: Partial<LectureScheduleDto>) {
    this.id = lectureSchedule.id;
    this.lectureId = lectureSchedule.lectureId;
    this.day = lectureSchedule.day;
    this.startDateTime = lectureSchedule.startDateTime;
    this.endDateTime = lectureSchedule.endDateTime;
    this.numberOfParticipants = lectureSchedule.numberOfParticipants;

    this.lecture = lectureSchedule.lecture
      ? new SimpleLectureDto(lectureSchedule.lecture)
      : undefined;

    Object.seal(this);
  }
}
