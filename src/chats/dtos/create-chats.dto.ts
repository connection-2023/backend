import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateChatsDto {
  @ApiProperty({ description: '채팅방 id', required: true })
  @IsNotEmpty()
  chatRoomId: string;

  @ApiProperty({ description: 'receiver', required: true })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  receiverId: number;

  @ApiProperty({ description: 'content', required: true })
  @IsNotEmpty()
  @IsString()
  content: string;
}
