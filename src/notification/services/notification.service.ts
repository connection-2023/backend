import { EventsGateway } from '@src/events/events.gateway';
import {
  INotificationSource,
  INotificationTarget,
} from '../interfaces/notification.interface';
import { NotificationRepository } from './../repositories/notification.repository';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

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
    type: string,
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
}
