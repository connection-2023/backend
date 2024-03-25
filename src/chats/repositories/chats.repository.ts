import { Injectable, Post, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chats } from '../schemas/chats.schema';
import mongoose, { Model } from 'mongoose';
import { ChatRoom } from '../schemas/chats-room.schema';
import {
  ChatInputData,
  ISenderAndReceiver,
} from '../interfaces/chats.interface';
import { ChatsDto } from '@src/common/dtos/chats.dto';

@Injectable()
export class ChatsRepository {
  constructor(
    @InjectModel(Chats.name) private readonly chatsModel: Model<Chats>,
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: Model<ChatRoom>,
  ) {}

  async createChats(chatInputData: ChatInputData): Promise<Chats> {
    return await this.chatsModel.create(chatInputData);
  }

  async getChatsWithChatRoomId(where, pageSize: number): Promise<Chats[]> {
    return await this.chatsModel
      .find(where)
      .sort({
        _id: -1,
      })
      .limit(pageSize)
      .exec();
  }

  async countChats(chattingRoomId: mongoose.Types.ObjectId): Promise<number> {
    return await this.chatsModel.countDocuments({ chattingRoomId });
  }

  async updatedUnreadChats(
    chattingRoomId: mongoose.Types.ObjectId,
  ): Promise<void> {
    await this.chatsModel
      .updateMany(
        { chattingRoomId, readedAt: null },
        { $set: { readedAt: new Date() } },
      )
      .exec();
  }

  async countTotalUnreadMessage(receiver): Promise<number> {
    return await this.chatsModel.countDocuments({
      ...receiver,
      readedAt: null,
    });
  }

  async participateChatRoom(
    chattingRoomId: mongoose.Types.ObjectId,
    updateData,
  ): Promise<void> {
    await this.chatRoomModel.findByIdAndUpdate(chattingRoomId, updateData);
  }
}
