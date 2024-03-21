import { ChatsRepository } from './../repositories/chats.repository';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ChatRoomRepository } from './../repositories/chats-room.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetSocketRoomIdDto } from '../dtos/get-socket-room-id.dto';
import { CreateChatRoomDto } from '../dtos/create-chat-room.dto';
import { v4 as uuidv4 } from 'uuid';
import { ChatRoomDto } from '@src/common/dtos/chats-room.dto';
import { ChatsDto } from '@src/common/dtos/chats.dto';

@Injectable()
export class ChatRoomService {
  constructor(
    private readonly chatRoomRepository: ChatRoomRepository,
    private readonly chatsRepository: ChatsRepository,
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

    const serializedChatRooms = [];

    for (const chatRoom of chatRooms) {
      chatRoom['unreadCount'] =
        await this.chatRoomRepository.countUnreadMessage(chatRoom._id);

      serializedChatRooms.push(new ChatRoomDto(chatRoom));
    }

    return serializedChatRooms;
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
}
