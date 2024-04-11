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
import { NotificationFilter } from '../enum/notification.enum';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async createNotification(
    target: INotificationTarget,
    title: string,
    source: INotificationSource,
    description: string,
  ) {
    const notification = await this.notificationRepository.createNotification(
      target,
      title,
      description,
      source,
    );
    const onlineMap =
      await this.notificationRepository.getOnlineMapWithTargetId(target);

    if (!onlineMap) {
      return;
    }

    const { socketId } = onlineMap;

    this.eventsGateway.server
      .to(socketId)
      .emit('handleNewNotification', notification);

    return notification;
  }

  async getMyNotification(
    authorizedData: ValidateResult,
    { lastItemId, pageSize, filterOption }: GetPageTokenQueryDto,
  ) {
    const where = this.getNotificationFilterOption(
      filterOption,
      authorizedData,
      lastItemId,
    );
    const notifications = await this.notificationRepository.getMyNotification(
      where,
      pageSize,
    );

    return notifications.map(
      (notification) => new NotificationDto(notification),
    );
  }

  async getMyUnreadNotification(authorizedData: ValidateResult) {
    const where = {};
    authorizedData.user
      ? (where['target.userId'] = authorizedData.user.id)
      : (where['target.lecturerId'] = authorizedData.lecturer.id);
  }

  private getNotificationFilterOption(
    filterOption: NotificationFilter,
    authorizedData: ValidateResult,
    lastItemId: string,
  ) {
    const where = {};
    authorizedData.user
      ? (where['target.userId'] = authorizedData.user.id)
      : (where['target.lecturerId'] = authorizedData.lecturer.id);

    lastItemId
      ? (where['_id'] = { $lt: new mongoose.Types.ObjectId(lastItemId) })
      : false;

    switch (filterOption) {
      case NotificationFilter.ReservedLecture:
        where['reservationId'] = { $exists: true };
        break;

      case NotificationFilter.CouponOrPass:
        where['couponId'] = { $exists: true };
        where['userPassId'] = { $exists: true };
        break;

      case NotificationFilter.LikedLecture:
        where['lectureId'] = { $exists: true };
        break;
    }

    return where;
  }
}
