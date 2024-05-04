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
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  PrismaTransaction,
  ValidateResult,
} from '@src/common/interface/common-interface';
import { NotificationDto } from '@src/common/dtos/notification.dto';
import mongoose from 'mongoose';
import {
  NotificationFilter,
  NotificationRecipientType,
} from '../enum/notification.enum';
import { GetMyNotificationQueryDto } from '../dtos/get-my-notification-query.dto';
import { CreateNotificationQueryDto } from '../dtos/create-notification-query.dto';
import * as admin from 'firebase-admin';
import { UserDeviceToken } from '@prisma/client';

@Injectable()
export class NotificationService {
  private logger = new Logger(NotificationService.name);
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
    retryCount = 3,
  ) {
    try {
      const userId = await this.getUserId(target);
      const notification = await this.notificationRepository.createNotification(
        target,
        title,
        description,
        source,
      );
      const userDeviceToken = await this.getUserDeviceToken(userId);

      await this.sendPushNotification(
        userDeviceToken.deviceToken,
        title,
        description,
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

      return new NotificationDto(notification);
    } catch (error) {
      this.logger.error(
        `Failed to create notification: ${error.message}. Retrying...`,
      );
      if (retryCount > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
        return this.createNotification(
          target,
          title,
          source,
          description,
          retryCount - 1,
        );
      } else {
        throw new Error(
          'Failed to create notification after retries: ' + error.message,
        );
      }
    }
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

    const reservations = await this.prismaService.reservation.findMany({
      where: {
        lecture: { lecturerId },
        userId: { in: targets },
      },
    });
    const reservationMap = new Map(
      reservations.map((res) => [res.userId, res]),
    );

    return await Promise.all(
      targets.map(async (target) => {
        if (!reservationMap.has(target)) return;

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

    const response = await admin.messaging().send(message);

    this.logger.log(response);
  }

  async registerDeviceToken(
    userId: number,
    { deviceToken }: RegisterDeviceTokenDto,
  ) {
    const userDeviceToken =
      await this.notificationRepository.upsertUserDeviceToken(
        userId,
        deviceToken,
      );

    return new UserDeviceTokenDto(userDeviceToken);
  }

  private async getUserDeviceToken(userId: number) {
    const userDeviceTokenInfo =
      await this.notificationRepository.getUserDeviceToken(userId);

    return new UserDeviceTokenDto(userDeviceTokenInfo);
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

  private async getUserId(target: INotificationTarget) {
    let userId: number;
    if (target.lecturerId) {
      const lecturer = await this.prismaService.lecturer.findFirst({
        where: { id: target.lecturerId },
      });

      userId = lecturer.userId;
    } else {
      userId = target.userId;
    }

    return userId;
  }
}
