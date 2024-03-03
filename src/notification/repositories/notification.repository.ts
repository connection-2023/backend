import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PrismaService } from '@src/prisma/prisma.service';
import { Model } from 'mongoose';
import {
  INotificationSource,
  INotificationTarget,
} from '../interfaces/notification.interface';
import { UserNotification } from '../schemas/notification.schema';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel(Notification.name)
    private readonly userNotificationModel: Model<UserNotification>,
  ) {}

  async createNotification(
    target: INotificationTarget,
    description: string,
    source: INotificationSource,
  ): Promise<UserNotification> {
    return await this.userNotificationModel.create({
      ...target,
      description,
      ...source,
    });
  }
}
