import { Lecture, LectureMethod } from '@prisma/client';
import { BaseReturnDto } from './base-return.dto';
import { ApiProperty } from '@nestjs/swagger';
import { LecturerDto } from './lecturer.dto';
import { LectureTypeDto } from './lecture-type.dto';
import { LectureImageDto } from './lecture-image.dto';

export class LectureDto extends BaseReturnDto implements Lecture {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({ description: '제목' })
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

  lecturer?: LecturerDto;
  lectureType: LectureTypeDto;
  lectureMethod: LectureMethod;

  @ApiProperty({
    description: '강의 이미지',
    type: LectureImageDto,
  })
  lectureImage?: LectureImageDto[];

  constructor(lecture: Partial<LectureDto>) {
    super();

    this.id = lecture.id;
    this.title = lecture.title;
    this.lectureImage = this.lectureImage;

    this.lecturer = lecture.lecturer
      ? new LecturerDto(lecture.lecturer)
      : undefined;

    this.lectureImage = lecture.lectureImage
      ? lecture.lectureImage.map((url) => new LectureImageDto(url))
      : null;

    Object.seal(this);
  }
}
