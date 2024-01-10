import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chats, ChatsSchema } from './schemas/chats.schema';
import { ChatRoom, ChatRoomSchema } from './schemas/chats-room.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chats.name, schema: ChatsSchema },
      { name: ChatRoom.name, schema: ChatRoomSchema },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class ChatsModule {}
