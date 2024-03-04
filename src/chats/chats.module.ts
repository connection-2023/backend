import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chats, ChatsSchema } from './schemas/chats.schema';
import { ChatRoom, ChatRoomSchema } from './schemas/chats-room.schema';
import { ChatRoomController } from './controllers/chats-room.controller';
import { ChatsController } from './controllers/chats.controller';
import { ChatsService } from './services/chats.service';
import { ChatsRepository } from './repositories/chats.repository';
import { ChatRoomService } from './services/chats-room.service';
import { ChatRoomRepository } from './repositories/chats-room.repository';
import { EventsGateway } from '@src/events/events.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chats.name, schema: ChatsSchema },
      { name: ChatRoom.name, schema: ChatRoomSchema },
    ]),
  ],
  controllers: [ChatRoomController, ChatsController],
  providers: [
    ChatsService,
    ChatsRepository,
    ChatRoomService,
    ChatRoomRepository,
    EventsGateway,
  ],
})
export class ChatsModule {}
