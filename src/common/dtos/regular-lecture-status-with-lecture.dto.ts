import { ApiProperty } from '@nestjs/swagger';
import { RegularLectureStatus } from '@prisma/client';
import { SimpleLectureDto } from '@src/lecturer/dtos/simple-lecture.dto';
import { RegularLectureScheduleDto } from './regular-lecture-schedule.dto';

export class RegularLectureStatusWithLectureDto
  implements RegularLectureStatus
{
  @ApiProperty({
    type: Number,
    description: '일정 id',
  })
  id: number;
  lectureId: number;

  @ApiProperty({
    type: [String],
    example: ['월', '화'],
    description: '수업 일정 요일',
  })
  day: string[];

  @ApiProperty({
    description: '수업 시간',
  })
  dateTime: string;

  @ApiProperty({
    type: Number,
    description: '현재 인원',
  })
  numberOfParticipants: number;

  @ApiProperty({
    type: SimpleLectureDto,
    description: '강의 정보',
  })
  lecture?: SimpleLectureDto;

  @ApiProperty({
    type: [RegularLectureScheduleDto],
    description: '강의 일정',
  })
  regularLectureSchedule?: RegularLectureScheduleDto[];

  constructor(lectureSchedule: Partial<RegularLectureStatusWithLectureDto>) {
    this.id = lectureSchedule.id;
    this.lectureId = lectureSchedule.lectureId;
    this.day = lectureSchedule.day;
    this.numberOfParticipants = lectureSchedule.numberOfParticipants;

    this.lecture = lectureSchedule.lecture
      ? new SimpleLectureDto(lectureSchedule.lecture)
      : undefined;
    this.regularLectureSchedule =
      lectureSchedule.regularLectureSchedule &&
      lectureSchedule.regularLectureSchedule[0]
        ? lectureSchedule.regularLectureSchedule.map(
            (lectureSchedule) => new RegularLectureScheduleDto(lectureSchedule),
          )
        : undefined;

    Object.seal(this);
  }
}
