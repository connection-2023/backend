import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chats } from '../schemas/chats.schema';
import { Model } from 'mongoose';
import { ChatRoom } from '../schemas/chats-room.schema';
import { ValidateResult } from '@src/common/interface/common-interface';

@Injectable()
export class ChatsRepository {
  constructor(
    @InjectModel(Chats.name) private readonly chatsModel: Model<Chats>,
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: Model<ChatRoom>,
  ) {}
}
