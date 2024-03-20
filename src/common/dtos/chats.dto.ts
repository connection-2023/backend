import { ISenderAndReceiver } from './../../chats/interfaces/chats.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import mongoose from 'mongoose';

@Exclude()
class SenderAndReceiver {
  @Expose()
  @ApiProperty({ description: '강사 id', type: Number })
  lecturerId?: number;

  @Expose()
  @ApiProperty({ description: '유저 Id', type: Number })
  userId?: number;

  constructor(user: Partial<SenderAndReceiver>) {
    this.lecturerId = user.lecturerId ? user.lecturerId : undefined;
    this.userId = user.userId ? user.userId : undefined;

    Object.assign(this);
  }
}

@Exclude()
export class ChatsDto {
  _id?: mongoose.Types.ObjectId;
  chattingRoomId: mongoose.Types.ObjectId;

  @Expose()
  @ApiProperty({ description: '채팅방 id' })
  chatRoomId?: string;

  @Expose()
  @ApiProperty({ description: '채팅 id' })
  id?: string;

  @Expose()
  @ApiProperty({
    description: 'sender',
    type: SenderAndReceiver,
  })
  sender: SenderAndReceiver;

  @Expose()
  @ApiProperty({
    description: 'receiver',
    type: SenderAndReceiver,
  })
  receiver: SenderAndReceiver;

  @Expose()
  @ApiProperty({ description: '내용' })
  content?: string;

  @Expose()
  @ApiProperty({ description: '이미지 url' })
  imageUrl?: string;

  @Expose()
  @ApiProperty({ description: '읽음 여부', type: Date })
  readedAt: Date;

  @Expose()
  @ApiProperty({ description: '보낸시간', type: Date })
  createdAt?: Date;

  constructor(chat: Partial<ChatsDto>) {
    this.id = chat._id.toString();
    this.chatRoomId = chat.chattingRoomId.toString();
    this.sender = new SenderAndReceiver(chat.sender);
    this.receiver = new SenderAndReceiver(chat.receiver);
    this.content = chat.content;
    this.imageUrl = chat.imageUrl;
    this.readedAt = chat.readedAt;
    this.createdAt = chat.createdAt;

    Object.assign(this);
  }
}
