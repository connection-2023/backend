import { ApiProperty } from '@nestjs/swagger';

export class CreateChatRoomDto {
  @ApiProperty({
    description: '상대방 강사 or 유저 id',
    example: '1',
    required: true,
  })
  targetId: number;
}
