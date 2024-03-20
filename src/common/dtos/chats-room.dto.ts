import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import mongoose from 'mongoose';
import { ChatsDto } from './chats.dto';

@Exclude()
export class ChatRoomDto {
  _id: mongoose.Types.ObjectId;

  @Expose()
  @ApiProperty({ description: 'chat room id' })
  id: string;

  @Expose()
  @ApiProperty({ description: '참여 유저 id', type: Number })
  userId: number;

  @Expose()
  @ApiProperty({ description: '참여 강사 id', type: Number })
  lecturerId: number;

  @Expose()
  @ApiProperty({ description: 'socket room id' })
  roomId: string;

  @Expose()
  @ApiProperty({ description: '채팅 안읽은 수', type: Number })
  unreadCount: number;

  @Expose()
  @ApiProperty({ description: '마지막 채팅', type: ChatsDto })
  lastChat?: ChatsDto;

  deletedAt: Date | null;

  constructor(room: Partial<ChatRoomDto>) {
    this.id = room._id.toString();
    this.userId = room.userId;
    this.lecturerId = room.lecturerId;
    this.roomId = room.roomId;
    this.unreadCount = room.unreadCount;
    this.lastChat = room.lastChat ? new ChatsDto(room.lastChat) : undefined;

    Object.assign(this);
  }
}
