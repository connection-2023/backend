import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { ChatRoomDto } from '@src/common/dtos/chats-room.dto';

export function ApiGetChatRoom() {
  return applyDecorators(
    ApiOperation({
      summary: '토큰 id와 상대방 id로 채팅방 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'chatRoom', ChatRoomDto),
  );
}
