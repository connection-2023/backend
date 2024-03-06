import { LectureMethodDto } from '@src/common/dtos/lecture-method.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { LectureImageDto } from '@src/common/dtos/lecture-image.dto';
import { Exclude, Expose } from 'class-transformer';
import { LecturerDto } from '@src/common/dtos/lecturer.dto';
import { LectureDto } from '@src/common/dtos/lecture.dto';

@Exclude()
export class EnrollSimpleLectureDto {
  @Expose()
  @ApiProperty({ description: '강의 id', type: Number })
  id: number;

  @Expose()
  @ApiProperty({ description: '강의 이미지', type: LectureImageDto })
  lectureImage?: LectureImageDto[];

  @Expose()
  @ApiProperty({ description: '원데이/정기', type: LectureMethodDto })
  lectureMethod?: LectureMethodDto;

  @Expose()
  @ApiProperty({ description: '강의 제목' })
  title: string;

  lecturer?: LecturerDto;

  constructor(lecture: EnrollSimpleLectureDto) {
    Object.assign(this, lecture);
    this.lectureImage = lecture.lectureImage
      ? lecture.lectureImage.map((image) => new LectureImageDto(image))
      : undefined;
  }
}
