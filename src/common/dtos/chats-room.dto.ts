import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class ChatRoomDto {
  _id: mongoose.Types.ObjectId;

  @ApiProperty({ description: 'chat room id' })
  id: string;

  @ApiProperty({ description: '참여 유저 id', type: Number })
  userId: number;

  @ApiProperty({ description: '참여 강사 id', type: Number })
  lecturerId: number;

  @ApiProperty({ description: 'socket room id' })
  roomId: string;

  deletedAt: Date | null;

  constructor(room: Partial<ChatRoomDto>) {
    this.id = room._id.toString();
    this.userId = room.userId;
    this.lecturerId = room.lecturerId;
    this.roomId = room.roomId;

    Object.assign(this);
  }
}
