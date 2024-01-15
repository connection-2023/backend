import { ApiProperty } from '@nestjs/swagger';
import { LecturePassTarget } from '@prisma/client';
import { PassLectureDto } from '@src/pass/dtos/pass-lecture.dto';

export class LecturePassTargetDto implements LecturePassTarget {
  id: number;
  lectureId: number;
  lecturePassId: number;

  @ApiProperty({
    description: '적용된 강의',
    type: PassLectureDto,
    isArray: true,
  })
  lecture: PassLectureDto;

  constructor(lecturePassTarget: Partial<LecturePassTargetDto>) {
    this.lecture = lecturePassTarget.lecture
      ? new PassLectureDto(lecturePassTarget.lecture)
      : null;
  }
}
