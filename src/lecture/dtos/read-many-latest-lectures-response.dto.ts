import { ApiProperty } from '@nestjs/swagger';
import { LectureDto } from '@src/common/dtos/lecture.dto';

export class ReadManyLatestLecturesResponseDto {
  @ApiProperty({
    description: '최신 8개 강의',
    type: LectureDto,
    isArray: true,
    nullable: true,
  })
  lectures?: LectureDto[];

  constructor(latestLectures: LectureDto[]) {
    this.lectures = latestLectures
      ? latestLectures.map((lecture) => new LectureDto(lecture))
      : [];

    Object.assign(this);
  }
}
