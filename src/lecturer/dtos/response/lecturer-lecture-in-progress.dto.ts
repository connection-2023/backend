import { ApiProperty } from '@nestjs/swagger';
import { LectureMethodDto } from '@src/common/dtos/lecture-method.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class LectureInProgressDto {
  @Expose()
  @ApiProperty({ description: '강의 id', type: Number })
  @Type(() => Number)
  id: number;

  @Expose()
  @ApiProperty({ description: '강의 제목' })
  title: string;

  @Expose()
  @ApiProperty({ description: '시작 일', type: Date })
  @Type(() => Date)
  startDate: Date;

  @Expose()
  @ApiProperty({ description: '마감 일', type: Date })
  @Type(() => Date)
  endDate: Date;

  @Expose()
  @ApiProperty({ description: '원데이/정기 여부', type: LectureMethodDto })
  @Type(() => LectureMethodDto)
  lectureMethod?: LectureMethodDto;

  @Expose()
  @ApiProperty({ description: '진행도', type: Number })
  @Type(() => Number)
  progress?: number;

  @Expose()
  @ApiProperty({ description: '일정 전체 수', type: Number })
  @Type(() => Number)
  schedulesCount?: number;

  @Expose()
  @ApiProperty({ description: '완료한 일정 수', type: Number })
  @Type(() => Number)
  completedSchedulesCount?: number;

  constructor(lecture: Partial<LectureInProgressDto>) {
    Object.assign(this, lecture);
  }
}
