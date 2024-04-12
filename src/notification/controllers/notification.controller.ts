import { PrismaService } from '@src/prisma/prisma.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { AllowUserAndLecturerGuard } from '@src/common/guards/allow-user-lecturer.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { GetPageTokenQueryDto } from '@src/chats/dtos/get-page-token.query.dto';
import { ApiNotification } from './swagger/notification.swagger';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { GetMyNotificationQueryDto } from '../dtos/get-my-notification-query.dto';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';
import { CreateNotificationDto } from '../dtos/create-notification.dto';

@ApiTags('알림')
@Controller('notifications/:id')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly prismaService: PrismaService,
  ) {}

  @ApiNotification.GetMyNotification({ summary: '내 알림 조회' })
  @SetResponseKey('notifications')
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
  @ApiNotification.CreateNotification({ summary: '개인 알림 생성' })
  @UseGuards(LecturerAccessTokenGuard)
  @Post()
  async createNotification(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createNotificationDto: CreateNotificationDto,
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
        return this.notificationService.createNotification(
          { userId: target },
          title,
          source,
          description,
        );
      }),
    );
  }

  @ApiNotification.DeleteNotification({ summary: '알림 삭제' })
  @UseGuards(AllowUserAndLecturerGuard)
  @Delete()
  async deleteNotification(@Param('id') id: string) {
    await this.notificationService.deleteNotification(id);
  }
}
