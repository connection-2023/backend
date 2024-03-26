import { ChatsRepository } from './../repositories/chats.repository';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ChatRoomRepository } from './../repositories/chats-room.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetSocketRoomIdDto } from '../dtos/get-socket-room-id.dto';
import { CreateChatRoomDto } from '../dtos/create-chat-room.dto';
import { v4 as uuidv4 } from 'uuid';
import { ChatRoomDto } from '@src/common/dtos/chats-room.dto';
import { ChatsDto } from '@src/common/dtos/chats.dto';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Chats } from '../schemas/chats.schema';
import { ChatRoom } from '../schemas/chats-room.schema';

@Injectable()
export class ChatRoomService {
  constructor(
    private readonly chatRoomRepository: ChatRoomRepository,
    private readonly chatsRepository: ChatsRepository,
    @InjectModel(Chats.name) private readonly chatsModel: Model<Chats>,
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: Model<ChatRoom>,
  ) {}

  async getSocketRoom(authorizedData: ValidateResult) {
    const where = authorizedData.user
      ? { 'user.id': authorizedData.user.id }
      : { 'lecturer.id': authorizedData.lecturer.id };

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
    const receiver = {};

    if (authorizedData.user) {
      where['$match'] = {
        'user.id': authorizedData.user.id,
        'user.participation': true,
        deletedAt: null,
      };

      receiver['receiver.userId'] = authorizedData.user.id;
    } else {
      where['$match'] = {
        'lecturer.id': authorizedData.lecturer.id,
        'lecturer.participation': true,
        deletedAt: null,
      };

      receiver['receiver.lecturerId'] = authorizedData.lecturer.id;
    }

    const chatRooms = await this.chatRoomRepository.getMyChatRooms(where);

    if (!chatRooms[0]) {
      throw new NotFoundException(`Chat room was not found`);
    }

    const serializedChatRooms = [];

    for (const chatRoom of chatRooms) {
      chatRoom['unreadCount'] =
        await this.chatRoomRepository.countUnreadMessage(
          chatRoom._id,
          receiver,
        );

      serializedChatRooms.push(new ChatRoomDto(chatRoom));
    }

    return serializedChatRooms;
  }

  async leaveChatRoom(
    authorizedData: ValidateResult,
    chattingRoomId: mongoose.Types.ObjectId,
  ) {
    const updateData = authorizedData.user
      ? { $set: { 'user.participation': false } }
      : { $set: { 'lecturer.participation': false } };

    const updatedChatRoom = await this.chatRoomRepository.leaveChatRoom(
      chattingRoomId,
      updateData,
    );

    return new ChatRoomDto(updatedChatRoom);
  }

  async deleteChatRoom(chattingRoomId: mongoose.Types.ObjectId) {
    await this.chatsModel.deleteMany({ chattingRoomId });
    await this.chatRoomModel.findByIdAndDelete(chattingRoomId);
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
