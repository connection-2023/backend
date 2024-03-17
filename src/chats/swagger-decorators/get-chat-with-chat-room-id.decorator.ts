import { ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ChatsDto } from '@src/common/dtos/chats.dto';
import { PaginationResponseDto } from '@src/common/swagger/dtos/pagination-response.dto';

export function ApiGetChatsWithChatRoomId() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅 조회',
    }),
    PaginationResponseDto.swaggerBuilder(HttpStatus.OK, 'chats', ChatsDto),
  );
}
