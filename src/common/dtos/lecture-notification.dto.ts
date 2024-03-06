import { LectureNotification } from '@prisma/client';
import { BaseReturnDto } from './base-return.dto';
import { ApiProperty } from '@nestjs/swagger';
import { LectureDto } from './lecture.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LectureNotificationDto {
  @Expose()
  @ApiProperty({ description: '공지 id', type: Number })
  id: number;

  @Expose()
  @ApiProperty({ description: '공지사항' })
  content: string;

  @Expose()
  @ApiProperty({ description: '수정일', type: Date })
  updatedAt: Date;

  lectureId: number;
  deletedAt: Date;

  lecture: LectureDto;

  constructor(lectureNotification: Partial<LectureNotification>) {
    this.id = lectureNotification.id;
    this.content = lectureNotification.notification;
    this.updatedAt = lectureNotification.updatedAt;

    Object.assign(this);
  }
}
