import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class GetChatsQueryDto {
  @ApiProperty({
    description:
      '페이지 토큰/첫 요청:생략 or null, 이후: 이전 페이지 마지막 item id 값',
  })
  @Type(() => mongoose.Types.ObjectId)
  pageToken: mongoose.Types.ObjectId;

  @ApiProperty({ description: '불러올 수', type: Number })
  @IsNumber()
  @Type(() => Number)
  pageSize: number;
}
