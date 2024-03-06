import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { EnrollLectureInfoDto } from './enroll-lecture-info.dto';

@Exclude()
export class EnrollLectureScheduleDto {
  @Expose()
  @ApiProperty({ description: '스케쥴 id', type: Number })
  @Type(() => Number)
  id: number;

  @Expose()
  @ApiProperty({ description: '시작시간', type: Date })
  @Type(() => Date)
  startDateTime: Date;

  @Expose()
  @ApiProperty({ description: '종료시간', type: Date })
  @Type(() => Date)
  endDateTime: Date;

  @Expose()
  @ApiProperty({ description: '참여인원', type: Number })
  numberOfParticipants: number;

  @Expose()
  @ApiProperty({ description: '최대인원', type: Number })
  @Type(() => Number)
  maxCapacity: number;

  @Expose()
  @ApiProperty({ description: '강의 정보', type: EnrollLectureInfoDto })
  @Type(() => EnrollLectureInfoDto)
  lecture?: EnrollLectureInfoDto;

  constructor(schedules) {
    Object.assign(this, schedules);

    if (schedules['regularLectureStatus']) {
      this.numberOfParticipants =
        schedules['regularLectureStatus']['numberOfParticipants'];

      this.lecture = new EnrollLectureInfoDto(
        schedules['regularLectureStatus']['lecture'],
      );

      this.maxCapacity =
        schedules['regularLectureStatus']['lecture']['maxCapacity'];
    } else {
      this.maxCapacity = schedules['lecture']['maxCapacity'];
    }
  }
}
