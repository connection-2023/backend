import { EventsGateway } from '@src/events/events.gateway';
import {
  INotificationSource,
  INotificationTarget,
} from '../interfaces/notification.interface';
import { NotificationRepository } from './../repositories/notification.repository';
import { Injectable } from '@nestjs/common';
import { ValidateResult } from '@src/common/interface/common-interface';
import { GetPageTokenQueryDto } from '@src/chats/dtos/get-page-token.query.dto';
import { NotificationDto } from '@src/common/dtos/notification.dto';
import mongoose from 'mongoose';
import { NotificationType } from '../enum/notification.enum';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async createNotification(
    target: INotificationTarget,
    source: INotificationSource,
    description: string,
  ) {
    const onlineMap =
      await this.notificationRepository.getOnlineMapWithTargetId(target);
    const { socketId } = onlineMap;
    const notification = await this.notificationRepository.createNotification(
      target,
      description,
      source,
    );

    this.eventsGateway.server
      .to(socketId)
      .emit('handleNewNotification', notification);

    return notification;
  }

  async getMyNotification(
    authorizedData: ValidateResult,
    { lastItemId, pageSize }: GetPageTokenQueryDto,
  ) {
    const where = {};
    authorizedData.user
      ? (where['target.userId'] = authorizedData.user.id)
      : (where['target.lecturerId'] = authorizedData.lecturer.id);

    lastItemId
      ? (where['_id'] = { $lt: new mongoose.Types.ObjectId(lastItemId) })
      : false;

    const notifications = await this.notificationRepository.getMyNotification(
      where,
      pageSize,
    );

    return notifications.map(
      (notification) => new NotificationDto(notification),
    );
  }
}
