import { Injectable, Post, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chats } from '../schemas/chats.schema';
import mongoose, { Model } from 'mongoose';
import { ChatRoom } from '../schemas/chats-room.schema';
import { ISenderAndReceiver } from '../interfaces/chats.interface';

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
      chattingRommId: roomObjectId,
      sender,
      receiver,
      content,
    });
  }
}
