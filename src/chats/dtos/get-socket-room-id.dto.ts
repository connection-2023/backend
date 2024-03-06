import { ApiProperty, PickType } from '@nestjs/swagger';
import { ChatRoomDto } from '@src/common/dtos/chats-room.dto';

export class GetSocketRoomIdDto {
  @ApiProperty({ description: '소켓 룸 id', type: Array })
  rooms: string[];

  constructor(rooms: ChatRoomDto[]) {
    this.rooms = rooms[0] ? rooms.map((room) => room.roomId) : [];

    Object.assign(this);
  }
}
