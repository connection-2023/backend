import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { AllowUserAndLecturerGuard } from '@src/common/guards/allow-user-lecturer.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { GetPageTokenQueryDto } from '@src/chats/dtos/get-page-token.query.dto';
import { ApiNotification } from './swagger/notification.swagger';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';

@ApiTags('알림')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiNotification.GetMyNotification({ summary: '내 알림 조회' })
  @SetResponseKey('notifications')
  @UseGuards(AllowUserAndLecturerGuard)
  @Get()
  async getMyNotification(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Query() getPageTokenQueryDto: GetPageTokenQueryDto,
  ) {
    return await this.notificationService.getMyNotification(
      authorizedData,
      getPageTokenQueryDto,
    );
  }
}
