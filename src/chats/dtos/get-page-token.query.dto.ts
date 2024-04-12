import { ApiProperty } from '@nestjs/swagger';
import { NotificationFilter } from '@src/notification/enum/notification.enum';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import mongoose from 'mongoose';

export class GetPageTokenQueryDto {
  @ApiProperty({
    description:
      '페이지 토큰/첫 요청:생략 or null, 이후: 이전 페이지 마지막 item id 값',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastItemId?: string;

  @ApiProperty({ description: '불러올 수', type: Number })
  @IsNumber()
  @Type(() => Number)
  pageSize: number;
}
