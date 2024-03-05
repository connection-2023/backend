import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PrismaService } from '@src/prisma/prisma.service';
import { Model } from 'mongoose';
import {
  INotificationSource,
  INotificationTarget,
} from '../interfaces/notification.interface';
import { Notification } from '../schemas/notification.schema';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  async createNotification(
    target: INotificationTarget,
    description: string,
    source: INotificationSource,
  ): Promise<Notification> {
    try {
      return await this.notificationModel.create({
        target,
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
}
