import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class ChatRoomDto {
  @ApiProperty({ description: '채팅방 고유 id', type: mongoose.Types.ObjectId })
  id?: mongoose.Types.ObjectId;

  @ApiProperty({ description: '참여 유저 id', type: Number })
  userId: number;

  @ApiProperty({ description: '참여 강사 id', type: Number })
  lecturerId: number;

  @ApiProperty({ description: '소켓 room id' })
  roomId: string;

  deletedAt: Date | null;

  constructor(room: Partial<ChatRoomDto>) {
    this.id = room.id;
    this.userId = room.userId;
    this.lecturerId = room.lecturerId;
    this.roomId = room.roomId;
  }
}
