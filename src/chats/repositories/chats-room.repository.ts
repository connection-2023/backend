import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chats } from '../schemas/chats.schema';
import { ChatRoom } from '../schemas/chats-room.schema';

@Injectable()
export class ChatRoomRepository {
  constructor(
    @InjectModel(Chats.name) private readonly chatsModel: Model<Chats>,
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: Model<ChatRoom>,
  ) {}

  async getRoomById(where): Promise<ChatRoom[]> {
    return await this.chatRoomModel.find({ where });
  }
}
