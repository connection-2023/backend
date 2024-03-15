import { ChatRoomRepository } from './../repositories/chats-room.repository';
import { CreateChatsDto } from './../dtos/create-chats.dto';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ChatsRepository } from './../repositories/chats.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';
import { EventsGateway } from '@src/events/events.gateway';
import { ChatsDto } from '@src/common/dtos/chats.dto';
import { GetPageTokenQueryDto } from '../dtos/get-page-token.query.dto';
import { CombinedChatWithCountDto } from '../dtos/responses/combined-chat-with-count.dto';

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

    const serializedChat = new ChatsDto(chat);

    this.eventsGateway.server
      .to(chatRoom.roomId)
      .emit('messageToClient', serializedChat);

    return serializedChat;
  }

  async getChatsWithChatRoomId(
    { lastItemId, pageSize }: GetPageTokenQueryDto,
    chatRoomId: mongoose.Types.ObjectId,
  ) {
    const where = { chattingRoomId: chatRoomId };
    lastItemId
      ? (where['_id'] = { $lt: new mongoose.Types.ObjectId(lastItemId) })
      : false;

    const chats = await this.chatsRepository.getChatsWithChatRoomId(
      where,
      pageSize,
    );

    const totalItemCount = await this.chatsRepository.countChats(chatRoomId);

    if (!chats[0]) {
      throw new NotFoundException(`chat not found`);
    }

    return new CombinedChatWithCountDto(chats, totalItemCount);
  }

  async updateUnreadMessage(chatRoomId: mongoose.Types.ObjectId) {
    await this.chatsRepository.updatedUnreadChats(chatRoomId);
    const chatRoom = await this.chatRoomRepository.getChatRoomWithChatRoomId(
      chatRoomId,
    );
    this.eventsGateway.server
      .to(chatRoom.roomId)
      .emit('updatedUnreadMessage', 'all messages are readed');
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
      sender['lecturerId'] = authorizedData.lecturer.id;
      receiver['userId'] = targetId;
    }

    return { sender, receiver };
  }
}
