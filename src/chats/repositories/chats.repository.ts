import { Injectable, Post, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chats } from '../schemas/chats.schema';
import mongoose, { Model } from 'mongoose';
import { ChatRoom } from '../schemas/chats-room.schema';
import { ISenderAndReceiver } from '../interfaces/chats.interface';
import { ChatsDto } from '@src/common/dtos/chats.dto';

@Injectable()
export class ChatsRepository {
  constructor(
    @InjectModel(Chats.name) private readonly chatsModel: Model<Chats>,
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: Model<ChatRoom>,
  ) {}

  async createChats(
    sender: ISenderAndReceiver,
    receiver: ISenderAndReceiver,
    content: string,
    roomObjectId: mongoose.Types.ObjectId,
  ): Promise<Chats> {
    return await this.chatsModel.create({
      chattingRoomId: roomObjectId,
      sender,
      receiver,
      content,
    });
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
}
