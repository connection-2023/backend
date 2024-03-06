import { ChatRoomDto } from '@src/common/dtos/chats-room.dto';
import { ChatRoomRepository } from './../repositories/chats-room.repository';
import { CreateChatsDto } from './../dtos/create-chats.dto';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ChatsRepository } from './../repositories/chats.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';
import { EventsGateway } from '@src/events/events.gateway';
import { ChatsDto } from '@src/common/dtos/chats.dto';
import { Chats } from '../schemas/chats.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { GetPageTokenQueryDto } from '../dtos/get-page-token.query.dto';

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

    this.eventsGateway.server.to(chatRoom.roomId).emit('messageToClient', chat);

    return new ChatsDto(chat);
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

    if (!chats[0]) {
      throw new NotFoundException(`chat not found`);
    }

    const chatRoom = await this.chatRoomRepository.getChatRoomWithChatRoomId(
      chatRoomId,
    );

    return chats.map((chat) => new ChatsDto(chat));
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
      sender['lecturerId'] = authorizedData.user.id;
      receiver['userId'] = targetId;
    }

    return { sender, receiver };
  }
}
