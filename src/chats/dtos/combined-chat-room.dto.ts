import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ChatRoomDto } from '@src/common/dtos/chats-room.dto';
import { ChatsDto } from '@src/common/dtos/chats.dto';
import mongoose from 'mongoose';

export class CombinedChatRoomDto {
  @ApiProperty({ description: '채팅방', type: ChatRoomDto })
  chatRoom: ChatRoomDto;

  @ApiProperty({ description: '채팅', type: ChatsDto, isArray: true })
  chats: ChatsDto[];

  constructor(
    chatRoomResult: Partial<ChatRoomDto>,
    chatsResult: Partial<ChatsDto[]>,
  ) {
    this.chatRoom = new ChatRoomDto(chatRoomResult);

    this.chats = chatsResult[0]
      ? chatsResult.map((chat) => new ChatsDto(chat))
      : [];

    Object.assign(this);
  }
}
