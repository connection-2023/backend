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

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @InjectModel(OnlineMap.name)
    private readonly onlineMapModel: Model<OnlineMap>,
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

  async getOnlineMapWithTargetId(
    target: INotificationTarget,
  ): Promise<OnlineMap> {
    return await this.onlineMapModel.findOne({ ...target, lastLogin: null });
  }

  async getMyUnreadNotification(
    target: INotificationTarget,
  ): Promise<Notification[]> {
    return await this.notificationModel.find({ target, readedAt: null });
  }
}
