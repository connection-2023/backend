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
import { EventsModule } from '@src/events/events.module';
import {
  OnlineMap,
  OnlineMapSchema,
} from '@src/events/schemas/online-map.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chats.name, schema: ChatsSchema },
      { name: ChatRoom.name, schema: ChatRoomSchema },
    ]),
    EventsModule,
  ],
  controllers: [ChatRoomController, ChatsController],
  providers: [
    ChatsService,
    ChatsRepository,
    ChatRoomService,
    ChatRoomRepository,
  ],
})
export class ChatsModule {}
