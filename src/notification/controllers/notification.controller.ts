import { plainToInstance } from 'class-transformer';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { AllowUserAndLecturerGuard } from '@src/common/guards/allow-user-lecturer.guard';
import { ApiTags } from '@nestjs/swagger';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ApiNotification } from './swagger/notification.swagger';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { GetMyNotificationQueryDto } from '../dtos/get-my-notification-query.dto';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { NotificationDto } from '@src/common/dtos/notification.dto';

@ApiTags('알림')
@Controller('notifications/:id')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly prismaService: PrismaService,
  ) {}

  @ApiNotification.GetMyNotification({ summary: '내 알림 조회' })
  @UseGuards(AllowUserAndLecturerGuard)
  @Get()
  async getMyNotification(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() getMyNotificationQueryDto: GetMyNotificationQueryDto,
  ) {
    return await this.notificationService.getMyNotification(
      authorizedData,
      getMyNotificationQueryDto,
    );
  }

  @ApiNotification.MarkNotificationAsRead({ summary: '알림 읽음 처리' })
  @SetResponseKey('updatedNotification')
  @Patch()
  async markNotificationAsRead(@Param('id') id: string) {
    return await this.notificationService.markNotificationAsRead(id);
  }

  @ApiNotification.GetUnreadNotificationCount({
    summary: '읽지 않은 알림 개수 조회',
  })
  @SetResponseKey('unreadNotificationCount')
  @UseGuards(AllowUserAndLecturerGuard)
  @Get('unread-count')
  async getUnreadNotificationCount(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ) {
    return await this.notificationService.getUnreadNotificationCount(
      authorizedData,
    );
  }

  @SetResponseKey('createdNotifications')
  @ApiNotification.CreateNotification({ summary: '강사 -> 수강생 알림 생성' })
  @UseGuards(LecturerAccessTokenGuard)
  @Post()
  async createNotification(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    return await this.notificationService.createManyNotifications(
      authorizedData,
      createNotificationDto,
    );
  }

  @ApiNotification.DeleteNotification({ summary: '알림 삭제' })
  @UseGuards(AllowUserAndLecturerGuard)
  @Delete()
  async deleteNotification(@Param('id') id: string) {
    await this.notificationService.deleteNotification(id);
  }
}
