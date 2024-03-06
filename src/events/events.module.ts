import { Module } from '@nestjs/common';
import { ChatsModule } from '@src/chats/chats.module';
import { ChatsRepository } from '@src/chats/repositories/chats.repository';
import { EventsGateway } from '@src/events/events.gateway';

@Module({
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
