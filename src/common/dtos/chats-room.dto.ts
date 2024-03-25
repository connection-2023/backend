import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import mongoose from 'mongoose';
import { ChatsDto } from './chats.dto';

@Exclude()
class privateUserAndLecturerInfo {
  @Expose()
  @ApiProperty({ description: '유저 또는 강사 id', type: Number })
  id: number;

  @Expose()
  @ApiProperty({ description: '해당 채팅방 참가 여부', type: Boolean })
  participation: boolean;

  constructor(user: privateUserAndLecturerInfo) {
    this.id = user.id;
    this.participation = user.participation;
    Object.assign(this);
  }
}

@Exclude()
export class ChatRoomDto {
  _id: mongoose.Types.ObjectId;

  @Expose()
  @ApiProperty({ description: 'chat room id' })
  id: string;

  @Expose()
  @ApiProperty({
    description: '참여 유저 id',
    type: privateUserAndLecturerInfo,
  })
  @Type(() => privateUserAndLecturerInfo)
  user: privateUserAndLecturerInfo;

  @Expose()
  @ApiProperty({
    description: '참여 강사 id',
    type: privateUserAndLecturerInfo,
  })
  @Type(() => privateUserAndLecturerInfo)
  lecturer: privateUserAndLecturerInfo;

  @Expose()
  @ApiProperty({ description: 'socket room id' })
  roomId: string;

  @Expose()
  @ApiProperty({ description: '채팅 안읽은 수', type: Number })
  unreadCount: number;

  @Expose()
  @ApiProperty({ description: '마지막 채팅', type: ChatsDto })
  @Type(() => ChatsDto)
  lastChat?: ChatsDto;

  deletedAt: Date | null;

  constructor(room: Partial<ChatRoomDto>) {
    this.id = room._id.toString();
    this.user = new privateUserAndLecturerInfo(room.user);
    this.lecturer = new privateUserAndLecturerInfo(room.lecturer);
    this.roomId = room.roomId;
    this.unreadCount = room.unreadCount;
    this.lastChat = room.lastChat ? new ChatsDto(room.lastChat) : undefined;

    Object.assign(this);
  }
}
