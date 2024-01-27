import { ChatRoomDto } from '@src/common/dtos/chats-room.dto';
import { ChatRoomRepository } from './../repositories/chats-room.repository';
import { CreateChatsDto } from './../dtos/create-chats.dto';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ChatsRepository } from './../repositories/chats.repository';
import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { EventsGateway } from '@src/events/events.gateway';

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly chatRoomRepository: ChatRoomRepository,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async createChats(
    authorizedData: ValidateResult,
    { receiverId, content, chatRoomId }: CreateChatsDto,
  ) {
    const { sender, receiver } = this.createSenderAndReceiver(
      authorizedData,
      receiverId,
    );
    const roomObjectId = new mongoose.Types.ObjectId(chatRoomId);

    const chat = await this.chatsRepository.createChats(
      sender,
      receiver,
      content,
      roomObjectId,
    );

    const chatRoom = await this.chatRoomRepository.getChatRoomWithChatRoomId(
      roomObjectId,
    );

    this.eventsGateway.server.to(chatRoom.roomId).emit('newChat', chat);

    return new ChatRoomDto(chat);
  }

  private createSenderAndReceiver(
    authorizedData: ValidateResult,
    targetId: number,
  ) {
    const sender = {};
    const receiver = {};

    if (authorizedData.user) {
      sender['userId'] = authorizedData.user.id;
      receiver['lecturerId'] = targetId;
    } else {
      sender['lecturerId'] = authorizedData.user.id;
      receiver['userId'] = targetId;
    }

    return { sender, receiver };
  }
}
