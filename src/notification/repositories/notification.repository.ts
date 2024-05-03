import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PrismaService } from '@src/prisma/prisma.service';
import { Model } from 'mongoose';
import {
  INotificationSource,
  INotificationTarget,
} from '../interfaces/notification.interface';
import { Notification } from '../schemas/notification.schema';
import { OnlineMap } from '@src/events/schemas/online-map.schema';
import { DeviceType, UserDeviceToken } from '@prisma/client';
import { PrismaTransaction } from '@src/common/interface/common-interface';
import { UserDeviceTokenDto } from '@src/common/dtos/user-device-token.dto';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @InjectModel(OnlineMap.name)
    private readonly onlineMapModel: Model<OnlineMap>,
    private readonly prismaService: PrismaService,
  ) {}

  async createNotification(
    target: INotificationTarget,
    title: string,
    description: string,
    source: INotificationSource,
  ): Promise<Notification> {
    try {
      return await this.notificationModel.create({
        target,
        title,
        description,
        ...source,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `알림 생성 실패: ${error}`,
        'NotificationCreateFailed',
      );
    }
  }

  async getMyNotification(where, pageSize: number): Promise<Notification[]> {
    return await this.notificationModel
      .find(where)
      .sort({ _id: -1 })
      .limit(pageSize)
      .exec();
  }

  async countMynotification(target): Promise<number> {
    return await this.notificationModel.countDocuments({
      ...target,
      deletedAt: null,
    });
  }

  async getOnlineMapWithTargetId(
    target: INotificationTarget,
  ): Promise<OnlineMap> {
    return await this.onlineMapModel.findOne({ ...target, lastLogin: null });
  }

  async markNotificationAsRead(notificationId: string): Promise<Notification> {
    return await this.notificationModel
      .findByIdAndUpdate(
        notificationId,
        { readedAt: new Date() },
        { new: true },
      )
      .exec();
  }

  async countUnreadNotifications(where): Promise<number> {
    return await this.notificationModel.countDocuments(where);
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await this.notificationModel.findByIdAndUpdate(notificationId, {
      deletedAt: new Date(),
    });
  }

  async getDeviceType(deviceType: string): Promise<DeviceType> {
    return await this.prismaService.deviceType.findFirst({
      where: { type: deviceType },
    });
  }

  async createUserDeviceToken(
    transaction: PrismaTransaction,
    userId: number,
    deviceToken: string,
  ): Promise<UserDeviceToken> {
    return await transaction.userDeviceToken.create({
      data: {
        userId,
        deviceToken,
      },
    });
  }

  async createUserDeviceTokenToDeviceType(
    transaction: PrismaTransaction,
    userDeviceTokenId: number,
    deviceTypeId: number,
  ): Promise<void> {
    await transaction.userDeviceTokenToDeviceType.create({
      data: {
        userDeviceTokenId: userDeviceTokenId,
        deviceTypeId: deviceTypeId,
      },
    });
  }

  async getUserDeviceToken(userId: number): Promise<UserDeviceTokenDto[]> {
    return await this.prismaService.userDeviceToken.findMany({
      where: { userId },
    });
  }
}
