import { ApiProperty } from '@nestjs/swagger';
import { LectureNotificationDto } from '@src/common/dtos/lecture-notification.dto';

export class LectureDetailDto {
  @ApiProperty({ description: '강의 id', type: Number })
  id: number;

  @ApiProperty({ description: '공지사항', type: LectureNotificationDto })
  lectureNotification?: LectureNotificationDto;

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
}
