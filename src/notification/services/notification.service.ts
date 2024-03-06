import { EventsGateway } from '@src/events/events.gateway';
import {
  INotificationSource,
  INotificationTarget,
} from '../interfaces/notification.interface';
import { NotificationRepository } from './../repositories/notification.repository';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ValidateResult } from '@src/common/interface/common-interface';
import { GetPageTokenQueryDto } from '@src/chats/dtos/get-page-token.query.dto';
import { NotificationDto } from '@src/common/dtos/notification.dto';
import { NotificationType } from 'aws-sdk/clients/budgets';
import mongoose from 'mongoose';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly eventsGateway: EventsGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createNotification(
    target: INotificationTarget,
    source: INotificationSource,
    type: NotificationType,
  ) {
    let description: string;

    switch (type) {
      case 'newLecture':
        description = '관심강사가 새로운 클래스를 개설했습니다.';
        break;
    }

    const onlineMap = await this.cacheManager.store.keys('onlineMap:*');

    for (const key of onlineMap) {
      const onlineUser = await this.cacheManager.get(key);

      if (onlineUser === target) {
        const socketId = key.slice(9);
        const notification = { target, source, description };

        this.eventsGateway.server
          .to(socketId)
          .emit('notificationToClient', notification);

        break;
      }
    }

    return await this.notificationRepository.createNotification(
      target,
      description,
      source,
    );
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
