import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import mongoose from 'mongoose';

@Exclude()
export class ChatsDto {
  _id: mongoose.Types.ObjectId;

  chattingRoomId: mongoose.Types.ObjectId;

  @Expose()
  @ApiProperty({ description: '채팅 id' })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'sender',
    type: Object,
    example: { userId: 1 },
  })
  sender: {
    userId?: number;
    lecturerId?: number;
  };

  @Expose()
  @ApiProperty({
    description: 'receiver',
    type: Object,
    example: { lecturerId: 14 },
  })
  receiver: {
    userId?: number;
    lecturerId?: number;
  };

  @Expose()
  @ApiProperty({ description: '내용' })
  content: string;

  @Expose()
  @ApiProperty({ description: '읽음 여부', type: Date })
  readedAt: Date;

  @Expose()
  @ApiProperty({ description: '보낸시간', type: Date })
  createdAt?: Date;

  constructor(chat: Partial<ChatsDto>) {
    this.id = chat._id.toString();
    this.sender = chat.sender.lecturerId
      ? { lecturerId: chat.sender.lecturerId }
      : { userId: chat.sender.userId };
    this.receiver = chat.receiver.lecturerId
      ? { lecturerId: chat.receiver.lecturerId }
      : { userId: chat.receiver.userId };
    this.content = chat.content;
    this.readedAt = chat.readedAt;

    Object.assign(this);
  }
}
