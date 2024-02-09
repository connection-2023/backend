import { ChatsRepository } from './../repositories/chats.repository';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ChatRoomRepository } from './../repositories/chats-room.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetSocketRoomIdDto } from '../dtos/get-socket-room-id.dto';
import { CreateChatRoomDto } from '../dtos/create-chat-room.dto';
import { v4 as uuidv4 } from 'uuid';
import { CombinedChatRoomDto } from '../dtos/combined-chat-room.dto';
import { ChatRoomDto } from '@src/common/dtos/chats-room.dto';
import { ChatRoom } from '../schemas/chats-room.schema';
import mongoose from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { OnlineListDto } from '../dtos/get-oline-list.dto';

@Injectable()
export class ChatRoomService {
  constructor(
    private readonly chatRoomRepository: ChatRoomRepository,
    private readonly chatsRepository: ChatsRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getSocketRoom(authorizedData: ValidateResult) {
    const where = authorizedData.user
      ? { userId: authorizedData.user.id }
      : { lecturerId: authorizedData.lecturer.id };

    const rooms = await this.chatRoomRepository.getSocketRoom(where);

    return new GetSocketRoomIdDto(rooms);
  }

  async createChatRoom(
    authorizedData: ValidateResult,
    { targetId }: CreateChatRoomDto,
  ) {
    const roomId = uuidv4();
    const { userId, lecturerId } = this.createUserIdAndLecturerId(
      authorizedData,
      targetId,
    );

    const chatRoom = await this.chatRoomRepository.createChatRoom(
      userId,
      lecturerId,
      roomId,
    );

    return new ChatRoomDto(chatRoom);
  }

  async getChatRoom(authorizedData: ValidateResult, targetId: number) {
    const { userId, lecturerId } = this.createUserIdAndLecturerId(
      authorizedData,
      targetId,
    );

    const chatRoom = await this.chatRoomRepository.getChatRoom(
      userId,
      lecturerId,
    );

    if (!chatRoom) {
      throw new NotFoundException(
        `chat room not found for user with ID: ${userId}, lecturer with ID: ${lecturerId}`,
      );
    }

    return new ChatRoomDto(chatRoom);
  }

  async getMyChatRoom(authorizedData: ValidateResult) {
    const where = {};
    if (authorizedData.user) {
      where['$match'] = { userId: authorizedData.user.id, deletedAt: null };
    } else {
      where['$match'] = {
        lecturerId: authorizedData.lecturer.id,
        deletedAt: null,
      };
    }

    const chatRooms = await this.chatRoomRepository.getMyChatRooms(where);

    if (!chatRooms[0]) {
      throw new NotFoundException(`chat room not found`);
    }

    return Promise.all(
      chatRooms.map(async (chatRoom) => {
        chatRoom['unreadCount'] =
          await this.chatRoomRepository.countUnreadMessage(chatRoom._id);

        return new ChatRoomDto(chatRoom);
      }),
    );
  }

  async getOnlineList(chatRoomId: mongoose.Types.ObjectId) {
    const chatRoom = await this.chatRoomRepository.getChatRoomWithChatRoomId(
      chatRoomId,
    );

    const keys = await this.cacheManager.store.keys();

    const onlineList = {};

    const onlineLecturer = this.findKeyByValue(keys, {
      lecturerId: chatRoom.lecturerId,
    });

    const onlineUser = this.findKeyByValue(keys, { userId: chatRoom.userId });

    onlineLecturer
      ? (onlineList['lecturerId'] = chatRoom.lecturerId)
      : undefined;
    onlineUser ? (onlineList['user'] = chatRoom.userId) : undefined;

    return new OnlineListDto(onlineList);
  }

  private createUserIdAndLecturerId(
    authorizedData: ValidateResult,
    targetId: number,
  ) {
    let userId: number;
    let lecturerId: number;

    if (authorizedData.user) {
      userId = authorizedData.user.id;
      lecturerId = targetId;
    } else {
      userId = targetId;
      lecturerId = authorizedData.lecturer.id;
    }

    return { userId, lecturerId };
  }

  async findKeyByValue(
    keys: string[],
    value: { [key: string]: number },
  ): Promise<string | null> {
    for (const key of keys) {
      const cachedValue = await this.cacheManager.get(key);
      if (JSON.stringify(cachedValue) === JSON.stringify(value)) {
        return key;
      }
    }
    return null;
  }
}
