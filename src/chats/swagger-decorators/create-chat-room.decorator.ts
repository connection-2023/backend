import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { ChatRoomDto } from '@src/common/dtos/chats-room.dto';

export function ApiCreateChatRoom() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅방 생성',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'chatRoom', ChatRoomDto),
  );
}
