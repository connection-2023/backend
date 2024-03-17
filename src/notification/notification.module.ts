import { Module } from '@nestjs/common';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from './schemas/notification.schema';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationHandler } from './events/notification.handler';
import { EventsGateway } from '@src/events/events.gateway';
import { EventsModule } from '@src/events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    EventsModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository, NotificationHandler],
})
export class NotificationModule {}
