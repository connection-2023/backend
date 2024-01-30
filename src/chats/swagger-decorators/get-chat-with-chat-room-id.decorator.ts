import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { ChatRoomDto } from '@src/common/dtos/chats-room.dto';
import { ChatsDto } from '@src/common/dtos/chats.dto';

export function ApiGetChatsWithChatRoomId() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅 조회',
    }),
    DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'chats', ChatsDto, {
      isArray: true,
    }),
  );
}
