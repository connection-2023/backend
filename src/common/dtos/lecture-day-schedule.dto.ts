import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { LectureDto } from './lecture.dto';

@Exclude()
export class LectureDayDto {
  @Expose()
  @ApiProperty({ description: '원데이 요일', type: Number })
  id: number;

  @Expose()
  @ApiProperty({ description: '강의 id', type: Number })
  lectureId: number;

  @Expose()
  @ApiProperty({ description: '요일', type: [String] })
  day: string[];

  @Expose()
  @ApiProperty({ description: '시간대', type: [String] })
  dateTime: string[];

  lecture?: LectureDto;

  constructor(lectureDay: LectureDayDto) {
    Object.assign(this, lectureDay);
  }
}
