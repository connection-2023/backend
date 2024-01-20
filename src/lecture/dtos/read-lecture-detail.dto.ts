import { ApiProperty } from '@nestjs/swagger';
import { LectureLocationDto } from '@src/common/dtos/lecture-location.dto';
import { LectureNotificationDto } from '@src/common/dtos/lecture-notification.dto';
import { ILecture } from '../interface/lecture.interface';
import { LecturerDto } from '@src/common/dtos/lecturer.dto';

export class LectureDetailDto {
  @ApiProperty({ description: '강의 id', type: Number })
  id: number;

  @ApiProperty({ description: '강사 정보', type: LecturerDto })
  lecturer: LecturerDto;

  @ApiProperty({ description: '공지사항', type: LectureNotificationDto })
  notification?: LectureNotificationDto;

  @ApiProperty({ description: '소개' })
  introduction?: string;

  @ApiProperty({ description: '커리큘럼' })
  curriculum: string;

  @ApiProperty({ description: '가격' })
  price: number;

  @ApiProperty({ description: '시작일', type: Date })
  startDate: Date;

  @ApiProperty({ description: '마감일', type: Date })
  endDate: Date;

  @ApiProperty({ description: '예약 데드라인', type: Number })
  reservationDeadline: number;

  @ApiProperty({ description: '예약 유의사항' })
  reservationComment: string;

  @ApiProperty({ description: '최대 정원', type: Number })
  maxCapacity: number;

  @ApiProperty({ description: '최소 정원', type: Number })
  minCapacity: number;

  @ApiProperty({ description: '리뷰 수', type: Number })
  reviewCount: number;

  @ApiProperty({ description: '지역 설명' })
  locationDescription: string;

  @ApiProperty({ description: '상세 지역', type: LectureLocationDto })
  location: LectureLocationDto;

  constructor(lecture: Partial<ILecture>) {
    this.id = lecture.id;
    this.lecturer = new LecturerDto(lecture.lecturer);
    this.startDate = lecture.startDate;
    this.endDate = lecture.endDate;
    this.reservationDeadline = lecture.reservationDeadline;
    this.reservationComment = lecture.reservationComment;
    this.price = lecture.price;
    this.notification = new LectureNotificationDto(lecture.lectureNotification);
    this.introduction = lecture.introduction;
    this.curriculum = lecture.curriculum;
    this.maxCapacity = lecture.maxCapacity;
    this.minCapacity = lecture.minCapacity;
    this.reviewCount = lecture.reviewCount;
    this.locationDescription = lecture.locationDescription;
    this.location = new LectureLocationDto(lecture.lectureLocation);

    Object.assign(this);
  }
}
