import { ApiProperty } from '@nestjs/swagger';
import { ISenderAndReceiver } from '@src/chats/interfaces/chats.interface';
import { TargetDto } from '@src/notification/dtos/target.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import mongoose from 'mongoose';

@Exclude()
export class NotificationDto {
  _id: mongoose.Types.ObjectId;

  @Expose()
  @ApiProperty({ description: '채팅 id' })
  id?: string;

  @Expose()
  @ApiProperty({ description: '제목' })
  title: string;

  @Expose()
  @ApiProperty({ description: '알림 내용' })
  description: string;

  @Expose()
  @ApiProperty({ description: '알림 대상' })
  @Type(() => TargetDto)
  target: TargetDto;

  @Expose()
  @ApiProperty({ description: '강의 id', type: Number })
  @Type(() => Number)
  lectureId: number;

  @Expose()
  @ApiProperty({ description: '강사 id', type: Number })
  lecturerId: number;

  @Expose()
  @ApiProperty({ description: '쿠폰 id', type: Number })
  @Type(() => Number)
  couponId: number;

  @Expose()
  @ApiProperty({ description: '강의 패스권 id', type: Number })
  @Type(() => Number)
  lecturePassId: number;

  @Expose()
  @ApiProperty({ description: '유저 패스권 id', type: Number })
  @Type(() => Number)
  userPassId: number;

  @Expose()
  @ApiProperty({ description: '읽음 여부', type: Date })
  readedAt: Date | null;

  @Expose()
  @ApiProperty({ description: '생성시간', type: Number })
  createdAt: Date;

  constructor(notification: Partial<NotificationDto>) {
    Object.assign(this, notification['_doc']);

    this.id = notification._id.toString();
  }
}
