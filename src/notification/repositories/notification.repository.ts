import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
    @InjectModel(UserNotification.name)
    private readonly userNotificationModel: Model<UserNotification>,
  ) {}

  async createNotification(
    target: INotificationTarget,
    description: string,
    source: INotificationSource,
  ): Promise<UserNotification> {
    try {
      return await this.userNotificationModel.create({
        ...target,
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
}
