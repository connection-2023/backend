import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsGateway } from '@src/events/events.gateway';
import { OnlineMap, OnlineMapSchema } from './schemas/online-map.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OnlineMap.name, schema: OnlineMapSchema },
    ]),
  ],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
