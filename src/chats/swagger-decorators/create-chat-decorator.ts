import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { ChatRoomDto } from '@src/common/dtos/chats-room.dto';
import { ChatsDto } from '@src/common/dtos/chats.dto';

export function ApiCreateChat() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅 생성',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'chat', ChatsDto),
  );
}
