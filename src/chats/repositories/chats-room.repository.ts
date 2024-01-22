import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chats } from '../schemas/chats.schema';
import { ChatRoom } from '../schemas/chats-room.schema';
import { uuid } from 'aws-sdk/clients/customerprofiles';

@Injectable()
export class ChatRoomRepository {
  constructor(
    @InjectModel(Chats.name) private readonly chatsModel: Model<Chats>,
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: Model<ChatRoom>,
  ) {}

  async getSocketRoom(where): Promise<ChatRoom[]> {
    return await this.chatRoomModel.find({ where });
  }

  async createChatRoom(
    userId: number,
    lecturerId: number,
    roomId: uuid,
  ): Promise<ChatRoom> {
    return await this.chatRoomModel.create({ userId, lecturerId, roomId });
  }
}
