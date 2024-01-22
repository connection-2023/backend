import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsModule } from '@src/chats/chats.module';
import { ChatRoom, ChatRoomSchema } from '@src/chats/schemas/chats-room.schema';
import { Chats, ChatsSchema } from '@src/chats/schemas/chats.schema';
import { EventsGateway } from '@src/events/events.gateway';

@Module({
  imports: [ChatsModule],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
