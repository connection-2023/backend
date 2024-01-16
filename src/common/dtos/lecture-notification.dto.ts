import { LectureNotification } from '@prisma/client';
import { BaseReturnDto } from './base-return.dto';
import { ApiProperty } from '@nestjs/swagger';
import { LectureDto } from './lecture.dto';

export class LectureNotificationDto implements LectureNotification {
  @ApiProperty({ description: '공지 id', type: Number })
  id: number;

  @ApiProperty({ description: '공지사항' })
  notification: string;

  @ApiProperty({ description: '수정일', type: Date })
  updatedAt: Date;

  lectureId: number;
  deletedAt: Date;

  lecture: LectureDto;

  constructor(lectureNotification: Partial<LectureNotificationDto>) {
    this.id = lectureNotification.id;
    this.notification = lectureNotification.notification;
    this.updatedAt = lectureNotification.updatedAt;

    Object.assign(this);
  }
}
