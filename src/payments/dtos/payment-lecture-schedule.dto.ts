import { ApiProperty } from '@nestjs/swagger';
import { LectureSchedule } from '@prisma/client';
import { LectureImageDto } from '@src/common/dtos/lecture-image.dto';
import { SimpleLectureDto } from '@src/lecturer/dtos/simple-lecture.dto';
import { Exclude, Expose } from 'class-transformer';

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
export class PaymentLectureScheduleDto implements LectureSchedule {
  @ApiProperty({
    description: '일정 id',
    type: Number,
  })
  @Expose()
  id: number;
  lectureId: number;
  day: number;

  @ApiProperty({
    description: '시작 시간',
    type: Date,
  })
  @Expose()
  startDateTime: Date;

  @ApiProperty({
    description: '종료 시간',
    type: Date,
  })
  @Expose()
  endDateTime: Date;

  @ApiProperty({
    description: '현재 인원',
    type: Number,
  })
  @Expose()
  numberOfParticipants: number;

  @ApiProperty({
    description: '강의 정보',
    type: PrivateSimpleLecture,
  })
  @Expose()
  lecture?: PrivateSimpleLecture;

  constructor(lectureSchedule: Partial<PaymentLectureScheduleDto>) {
    Object.assign(this, lectureSchedule);

    this.lecture = lectureSchedule.lecture
      ? new PrivateSimpleLecture(lectureSchedule.lecture)
      : undefined;
  }
}
