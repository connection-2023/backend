import { ApiProperty } from '@nestjs/swagger';
import { LectureLocationDto } from '@src/common/dtos/lecture-location.dto';
import { LectureNotificationDto } from '@src/common/dtos/lecture-notification.dto';
import { ILecture } from '../interface/lecture.interface';

export class LectureDetailDto {
  @ApiProperty({ description: '강의 id', type: Number })
  id: number;

  @ApiProperty({ description: '공지사항', type: LectureNotificationDto })
  notification?: LectureNotificationDto;

  @ApiProperty({ description: '소개' })
  introduction?: string;

  @ApiProperty({ description: '커리큘럼' })
  curriculum: string;

  @ApiProperty({ description: '최대 정원', type: Number })
  maxCapacity: number;

  @ApiProperty({ description: '리뷰 수', type: Number })
  reviewCount: number;

  @ApiProperty({ description: '지역 설명' })
  locationDescription: string;

  @ApiProperty({ description: '상세 지역', type: LectureLocationDto })
  location: LectureLocationDto;

  constructor(lecture: Partial<ILecture>) {
    this.id = lecture.id;
    this.notification = lecture.lectureNotification;
    this.introduction = lecture.introduction;
    this.curriculum = lecture.curriculum;
    this.maxCapacity = lecture.maxCapacity;
    this.reviewCount = lecture.reviewCount;
    this.locationDescription = lecture.locationDescription;
    this.location = lecture.lectureLocation;

    Object.assign(this);
  }
}
