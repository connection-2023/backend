import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ChatTargetDto } from '../../chats/dtos/responses/chat-target.dto';
import { LectureScheduleDto } from '@src/common/dtos/lecture-schedule.dto';
import { RegularLectureStatusDto } from '@src/common/dtos/regular-lecture-status.dto';
import { LectureDto } from '@src/common/dtos/lecture.dto';
import { SimpleLectureDto } from '@src/lecturer/dtos/simple-lecture.dto';

@Exclude()
export class RegistLectureScheduleDto {
  @Expose()
  @ApiProperty({ description: '강의 정보', type: SimpleLectureDto })
  @Type(() => SimpleLectureDto)
  lecture: SimpleLectureDto;

  @Expose()
  @ApiProperty({ description: '예약한 가장 마지막 스케쥴' })
  startDateTime: Date;

  regularLectureStatus?: RegularLectureStatusDto;

  constructor(schedule: Partial<RegistLectureScheduleDto>) {
    Object.assign(this, schedule);
  }
}
