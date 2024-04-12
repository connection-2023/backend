import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    description: '알림 대상 user id',
    example: [1, 2, 3, 4, 5],
    type: [Number],
  })
  @IsNotEmpty()
  @IsArray()
  targets: number[];

  @ApiProperty({ description: '알림 내용', example: '내일 수업 쩔수없이 쉼' })
  @IsNotEmpty()
  @IsString()
  description: string;
}
