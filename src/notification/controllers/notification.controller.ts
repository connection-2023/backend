import {
  Controller,
  Get,
  Inject,
  Param,
  Patch,
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

@ApiTags('알림')
@Controller('notifications/:id')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

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
}
