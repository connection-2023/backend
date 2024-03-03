import { ApiProperty } from '@nestjs/swagger';
import { LecturePassTarget } from '@prisma/client';
import { PassLectureDto } from '@src/pass/dtos/pass-lecture.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import { BasicLectureDto } from './basic-lecture.dto';

@Exclude()
export class LecturePassTargetDto implements LecturePassTarget {
  id: number;
  lectureId: number;
  lecturePassId: number;

  @ApiProperty({
    description: '적용된 강의',
    type: BasicLectureDto,
    isArray: true,
  })
  @Type(() => BasicLectureDto)
  @Expose()
  lecture: BasicLectureDto[];

  constructor(lecturePassTarget: Partial<LecturePassTargetDto>) {
    Object.assign(this, lecturePassTarget);
  }
}
