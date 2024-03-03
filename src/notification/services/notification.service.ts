import {
  INotificationSource,
  INotificationTarget,
} from '../interfaces/notification.interface';
import { NotificationRepository } from './../repositories/notification.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
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

    return await this.notificationRepository.createNotification(
      target,
      description,
      source,
    );
  }
}
