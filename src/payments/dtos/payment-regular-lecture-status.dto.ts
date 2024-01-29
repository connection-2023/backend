import { ApiProperty } from '@nestjs/swagger';
import { RegularLectureStatus } from '@prisma/client';
import { LectureImageDto } from '@src/common/dtos/lecture-image.dto';
import { RegularLectureScheduleDto } from '@src/common/dtos/regular-lecture-schedule.dto';
import { SimpleLectureDto } from '@src/lecturer/dtos/simple-lecture.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
class PrivateSimpleLecture extends SimpleLectureDto {
  lectureImage?: LectureImageDto;

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
export class PaymentRegularLectureStatusDto implements RegularLectureStatus {
  @ApiProperty({
    type: Number,
    description: '일정 id',
  })
  @Expose()
  id: number;
  lectureId: number;

  @ApiProperty({
    type: [String],
    example: ['월', '화'],
    description: '수업 일정 요일',
  })
  @Expose()
  day: string[];

  @ApiProperty({
    type: [String],
    description: '수업 시간',
  })
  @Expose()
  dateTime: string[];

  @ApiProperty({
    type: Number,
    description: '현재 인원',
  })
  @Expose()
  numberOfParticipants: number;

  @ApiProperty({
    type: SimpleLectureDto,
    description: '강의 정보',
  })
  @Expose()
  lecture?: SimpleLectureDto;

  @ApiProperty({
    type: [SimpleLectureDto],
    description: '강의 일정',
  })
  @Expose()
  regularLectureSchedule?: RegularLectureScheduleDto[];

  constructor(lectureSchedule: Partial<PaymentRegularLectureStatusDto>) {
    this.id = lectureSchedule.id;
    this.lectureId = lectureSchedule.lectureId;
    this.day = lectureSchedule.day;
    this.numberOfParticipants = lectureSchedule.numberOfParticipants;

    this.lecture = lectureSchedule.lecture
      ? new PrivateSimpleLecture(lectureSchedule.lecture)
      : undefined;

    this.regularLectureSchedule =
      lectureSchedule.regularLectureSchedule &&
      lectureSchedule.regularLectureSchedule[0]
        ? lectureSchedule.regularLectureSchedule.map(
            (lectureSchedule) => new RegularLectureScheduleDto(lectureSchedule),
          )
        : undefined;

    console.log(lectureSchedule.regularLectureSchedule);

    Object.seal(this);
  }
}
