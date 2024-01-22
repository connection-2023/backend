import { PickType } from '@nestjs/swagger';
import { ChatRoomDto } from '@src/common/dtos/chats-room.dto';

export class GetSocketRoomIdDto extends PickType(ChatRoomDto, [
  'roomId',
] as const) {
  constructor(room: ChatRoomDto) {
    super();

    this.roomId = room.roomId;
  }
}
