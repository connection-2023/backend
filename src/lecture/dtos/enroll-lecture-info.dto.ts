import { ApiProperty } from '@nestjs/swagger';
import { LectureMethodDto } from '@src/common/dtos/lecture-method.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class EnrollLectureInfoDto {
  @Expose()
  @ApiProperty({ description: '강의 id', type: Number })
  @Type(() => Number)
  id: number;

  @Expose()
  @ApiProperty({ description: '강의 제목' })
  title: string;

  @Expose()
  @ApiProperty({ description: '원데이 정기 여부', type: LectureMethodDto })
  @Type(() => LectureMethodDto)
  lectureMethod?: LectureMethodDto;

  constructor(lecture: EnrollLectureInfoDto) {
    Object.assign(this, lecture);
  }
}
