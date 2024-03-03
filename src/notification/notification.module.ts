import { Module } from '@nestjs/common';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserNotification,
  UserNotificationSchema,
} from './schemas/notification.schema';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationHandler } from './events/notification.handler';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserNotification.name, schema: UserNotificationSchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository, NotificationHandler],
})
export class NotificationModule {}
