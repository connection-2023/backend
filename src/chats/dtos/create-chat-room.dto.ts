import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateChatRoomDto {
  @ApiProperty({
    description: '상대방 강사 or 유저 id',
    example: '1',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  targetId: number;
}
