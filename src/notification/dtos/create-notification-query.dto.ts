import { ApiProperty } from '@nestjs/swagger';
import { NotificationRecipientType } from '../enum/notification.enum';
import { IsEnum, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNotificationQueryDto {
  @ApiProperty({
    description: '전송할 알림 type',
    enum: NotificationRecipientType,
    required: true,
  })
  @IsEnum(NotificationRecipientType, { each: true })
  @IsNotEmpty()
  recipientType: NotificationRecipientType;

  @ApiProperty({ description: '대상 강의 id', required: false })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ValidateIf(
    ({ recipientType }) =>
      recipientType === NotificationRecipientType.SPECIFIC_LECTURE_STUDENTS,
  )
  lectureId?: number;
}
