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
}

@Exclude()
export class ChatsDto {
  _id?: mongoose.Types.ObjectId;

  @Expose()
  @ApiProperty({ description: '채팅방 id' })
  @Type(() => String)
  chattingRoomId: mongoose.Types.ObjectId;

  @Expose()
  @ApiProperty({ description: '채팅 id' })
  id?: string;

  @Expose()
  @ApiProperty({
    description: 'sender',
    type: SenderAndReceiver,
  })
  @Type(() => SenderAndReceiver)
  sender: SenderAndReceiver;

  @Expose()
  @ApiProperty({
    description: 'receiver',
    type: SenderAndReceiver,
  })
  @Type(() => SenderAndReceiver)
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
    Object.assign(this, chat['_doc']);
    this.id = chat._id.toString();
  }
}
