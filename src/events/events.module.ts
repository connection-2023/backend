import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsGateway } from '@src/events/events.gateway';
import { OnlineMap, OnlineMapSchema } from './schemas/online-map.schema';
import { EventsController } from './controllers/events.controller';
import { EventsService } from './services/events.service';
import { EventsRepository } from './repositories/events.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OnlineMap.name, schema: OnlineMapSchema },
    ]),
  ],
  providers: [EventsGateway, EventsService, EventsRepository],
  exports: [EventsGateway],
  controllers: [EventsController],
})
export class EventsModule {}
