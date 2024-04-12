import { GetPageTokenQueryDto } from '@src/chats/dtos/get-page-token.query.dto';
import { NotificationFilter } from '../enum/notification.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetMyNotificationQueryDto extends GetPageTokenQueryDto {
  @ApiProperty({
    description: '필터 옵션',
    enum: NotificationFilter,
    required: true,
  })
  @IsEnum(NotificationFilter, { each: true })
  @IsNotEmpty()
  filterOption: NotificationFilter;
}
