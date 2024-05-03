import { UserDeviceTokenDto } from './../../common/dtos/user-device-token.dto';
import { RegisterDeviceTokenDto } from './../dtos/register-device-token.dto';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateNotificationDto } from './../dtos/create-notification.dto';
import { EventsGateway } from '@src/events/events.gateway';
import {
  INotificationSource,
  INotificationTarget,
} from '../interfaces/notification.interface';
import { NotificationRepository } from './../repositories/notification.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  PrismaTransaction,
  ValidateResult,
} from '@src/common/interface/common-interface';
import { NotificationDto } from '@src/common/dtos/notification.dto';
import mongoose from 'mongoose';
import {
  DeviceType,
  NotificationFilter,
  NotificationRecipientType,
} from '../enum/notification.enum';
import { GetMyNotificationQueryDto } from '../dtos/get-my-notification-query.dto';
import { CreateNotificationQueryDto } from '../dtos/create-notification-query.dto';
import * as admin from 'firebase-admin';

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

    return new NotificationDto(notification);
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

    where['_id'] ? delete where['_id'] : false;

    const totalItemCount =
      await this.notificationRepository.countMynotification(where);

    const serializedNotifications = notifications.map(
      (notification) => new NotificationDto(notification),
    );

    return { notifications: serializedNotifications, totalItemCount };
  }

  async createManyNotifications(
    authorizedData: ValidateResult,
    createNotificationDto: CreateNotificationDto,
    createNotificationQueryDto: CreateNotificationQueryDto,
  ) {
    const lecturerId = authorizedData.lecturer.id;
    const { description } = createNotificationDto;
    const source = { lecturerId };
    const lecturer = await this.prismaService.lecturer.findFirst({
      where: { id: lecturerId },
    });
    const title = lecturer.nickname;
    const targets = await this.getNotificationTarget(
      lecturerId,
      createNotificationDto,
      createNotificationQueryDto,
    );

    return await Promise.all(
      targets.map(async (target) => {
        const reservation = await this.prismaService.reservation.findFirst({
          where: { lecture: { lecturerId }, userId: target },
        });

        if (!reservation) return;

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

  async sendPushNotification(token: string, title: string, body: string) {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: token,
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  async registerDeviceToken(
    userId: number,
    { deviceToken, deviceType }: RegisterDeviceTokenDto,
  ) {
    return await this.prismaService.$transaction(
      async (transaction: PrismaTransaction) => {
        const deviceTypeInfo = await this.notificationRepository.getDeviceType(
          deviceType,
        );

        if (!deviceTypeInfo) {
          throw new BadRequestException(
            `Device type '${deviceType}' is not recognized or supported.`,
          );
        }
        const userDeviceToken =
          await this.notificationRepository.createUserDeviceToken(
            transaction,
            userId,
            deviceToken,
          );
        await this.notificationRepository.createUserDeviceTokenToDeviceType(
          transaction,
          userDeviceToken.id,
          deviceTypeInfo.id,
        );

        return new UserDeviceTokenDto(userDeviceToken);
      },
    );
  }

  async getUserDeviceToken(userId: number) {
    const userDeviceTokenInfo =
      await this.notificationRepository.getUserDeviceToken(userId);

    return userDeviceTokenInfo.map(
      (userDeviceToken) => new UserDeviceTokenDto(userDeviceToken),
    );
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
      case NotificationFilter.RESERVED:
        where['reservationId'] = { $exists: true };
        break;

      case NotificationFilter.COUPON_OR_PASS:
        where['$or'] = [
          { couponId: { $exists: true } },
          { userPassId: { $exists: true } },
        ];
        break;

      case NotificationFilter.LIKED:
        where['lectureId'] = { $exists: true };
        break;

      case NotificationFilter.UNREAD:
        where['readedAt'] = null;
        break;
    }

    return where;
  }

  private async getNotificationTarget(
    lecturerId: number,
    { targets }: CreateNotificationDto,
    { recipientType, lectureId }: CreateNotificationQueryDto,
  ) {
    switch (recipientType) {
      case NotificationRecipientType.ALL_STUDENTS:
        return this.getLecturerStudents(lecturerId);

      case NotificationRecipientType.SPECIFIC_LECTURE_STUDENTS:
        return this.getSpecificLectureStudents(lecturerId, lectureId);

      case NotificationRecipientType.SPECIFIC_STUDENTS:
        if (!targets) {
          throw new BadRequestException(
            'Targets do not exist',
            'TargetsIsEmpty',
          );
        }
        return targets;
    }
  }

  private async getSpecificLectureStudents(
    lecturerId: number,
    lectureId: number,
  ) {
    const targets = await this.prismaService.reservation.findMany({
      where: { lectureId, lecture: { lecturerId } },
      select: { userId: true },
      distinct: ['userId'],
    });

    return targets.map((target) => target.userId);
  }

  private async getLecturerStudents(lecturerId: number) {
    const targets = await this.prismaService.reservation.findMany({
      where: { lecture: { lecturerId } },
      select: { userId: true },
      distinct: ['userId'],
    });

    return targets.map((target) => target.userId);
  }
}
