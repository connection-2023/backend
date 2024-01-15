import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chats } from '../schemas/chats.schema';
import { Model } from 'mongoose';
import { ChatRoom } from '../schemas/chats-room.schema';

@Injectable()
export class ChatsRepository {
  constructor(
    @InjectModel(Chats.name) private readonly chatsModel: Model<Chats>,
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: Model<ChatRoom>,
  ) {}
}
