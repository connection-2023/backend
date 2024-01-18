import { Lecture } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { BaseReturnDto } from '@src/common/dtos/base-return.dto';
import { LectureImageDto } from '@src/common/dtos/lecture-image.dto';
import { LecturerDto } from '@src/common/dtos/lecturer.dto';

export class PassLectureDto extends BaseReturnDto implements Lecture {
  @ApiProperty({
    description: '강의 Id',
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: '강의 제목',
    type: Number,
  })
  title: string;

  lecturerId: number;
  lectureTypeId: number;
  lectureMethodId: number;
  isGroup: boolean;
  startDate: Date;
  endDate: Date;
  introduction: string;
  curriculum: string;
  duration: number;
  difficultyLevel: string;
  minCapacity: number;
  maxCapacity: number;
  reservationDeadline: number;
  reservationComment: string;
  price: number;
  noShowDeposit: number;
  reviewCount: number;
  stars: number;
  isActive: boolean;
  locationDescription: string;
  deletedAt: Date;

  @ApiProperty({
    description: '강의 이미지',
    type: LectureImageDto,
  })
  lectureImage?: LectureImageDto[];

  constructor(lecture: Partial<PassLectureDto>) {
    super();

    this.id = lecture.id;
    this.title = lecture.title;

    this.lectureImage = lecture.lectureImage
      ? lecture.lectureImage.map((image) => new LectureImageDto(image))
      : undefined;

    Object.assign(this);
  }
}
