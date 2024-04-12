import { PrismaService } from '@src/prisma/prisma.service';
import { CreateNotificationDto } from './../dtos/create-notification.dto';
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
import { GetMyNotificationQueryDto } from '../dtos/get-my-notification-query.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly eventsGateway: EventsGateway,
    private readonly prismaService: PrismaService,
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
      return new NotificationDto(notification);
    }

    const { socketId } = onlineMap;

    this.eventsGateway.server
      .to(socketId)
      .emit('handleNewNotification', notification);
  }

  async getMyNotification(
    authorizedData: ValidateResult,
    { lastItemId, pageSize, filterOption }: GetMyNotificationQueryDto,
  ) {
    const where = this.getNotificationFilterOption(
      authorizedData,
      lastItemId,
      filterOption,
    );
    const notifications = await this.notificationRepository.getMyNotification(
      where,
      pageSize,
    );

    return notifications.map(
      (notification) => new NotificationDto(notification),
    );
  }

  async createManyNotifications(
    authorizedData: ValidateResult,
    createNotificationDto: CreateNotificationDto,
  ) {
    const lecturerId = authorizedData.lecturer.id;
    const { targets, description } = createNotificationDto;
    const source = { lecturerId };
    const lecturer = await this.prismaService.lecturer.findFirst({
      where: { id: lecturerId },
    });
    const title = lecturer.nickname;

    return await Promise.all(
      targets.map(async (target) => {
        return this.createNotification(
          { userId: target },
          title,
          source,
          description,
        );
      }),
    );
  }

  async markNotificationAsRead(notificationId: string) {
    const updatedNotification =
      await this.notificationRepository.markNotificationAsRead(notificationId);

    return new NotificationDto(updatedNotification);
  }

  async getUnreadNotificationCount(authorizedData: ValidateResult) {
    const where = { readedAt: null, deletedAt: null };
    authorizedData.user
      ? (where['target.userId'] = authorizedData.user.id)
      : (where['target.lecturerId'] = authorizedData.lecturer.id);

    return await this.notificationRepository.countUnreadNotifications(where);
  }

  async deleteNotification(notificationId: string) {
    await this.notificationRepository.deleteNotification(notificationId);
  }

  private getNotificationFilterOption(
    authorizedData: ValidateResult,
    lastItemId: string,
    filterOption: NotificationFilter,
  ) {
    const where = { deletedAt: null };
    authorizedData.user
      ? (where['target.userId'] = authorizedData.user.id)
      : (where['target.lecturerId'] = authorizedData.lecturer.id);

    lastItemId
      ? (where['_id'] = { $lt: new mongoose.Types.ObjectId(lastItemId) })
      : false;

    switch (filterOption) {
      case NotificationFilter.Reserved:
        where['reservationId'] = { $exists: true };
        break;

      case NotificationFilter.CouponOrPass:
        where['couponId'] = { $exists: true };
        where['userPassId'] = { $exists: true };
        break;

      case NotificationFilter.Liked:
        where['lectureId'] = { $exists: true };
        break;

      case NotificationFilter.Unread:
        where['readedAt'] = null;
        break;
    }

    return where;
  }
}
