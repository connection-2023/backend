import { ApiProperty } from '@nestjs/swagger';
import { LectureSchedule } from '@prisma/client';
import { LectureImageDto } from '@src/common/dtos/lecture-image.dto';
import { SimpleLectureDto } from '@src/lecturer/dtos/simple-lecture.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import { BasicPaymentLectureScheduleDto } from './response/basic-payment-lecture-schedule.dto';

@Exclude()
class PrivateSimpleLecture extends SimpleLectureDto {
  lectureImage?: LectureImageDto[];

  @ApiProperty({
    description: '강의 이미지 url',
  })
  @Expose()
  imageUrl?: string;

  constructor(lecture: Partial<PrivateSimpleLecture>) {
    super(lecture);
    Object.assign(this, lecture);

    this.imageUrl =
      lecture.lectureImage && lecture.lectureImage[0]
        ? lecture.lectureImage[0].imageUrl
        : null;
  }
}

@Exclude()
export class PaymentLectureScheduleWithLectureDto extends BasicPaymentLectureScheduleDto {
  @ApiProperty({
    description: '강의 정보',
    type: PrivateSimpleLecture,
  })
  @Type(() => PrivateSimpleLecture)
  @Expose()
  lecture?: PrivateSimpleLecture;

  constructor(lectureSchedule: Partial<PaymentLectureScheduleWithLectureDto>) {
    super();
    Object.assign(this, lectureSchedule);
  }
}
