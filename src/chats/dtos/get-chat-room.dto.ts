import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ChatRoomDto } from '@src/common/dtos/chats-room.dto';
import mongoose from 'mongoose';

export class GetChatRoomDto extends OmitType(ChatRoomDto, ['_id'] as const) {
  @ApiProperty({ description: '채팅방 id', type: mongoose.Types.ObjectId })
  id: string;

  constructor(room: Partial<ChatRoomDto>) {
    super();

    this.id = room._id.toString();
    this.userId = room.userId;
    this.lecturerId = room.lecturerId;
    this.roomId = room.roomId;

    Object.seal(this);
  }
}
