import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { ChatRoomDto } from '@src/common/dtos/chats-room.dto';

export function ApiGetMyChatRoom() {
  return applyDecorators(
    ApiOperation({
      summary: '내 채팅방 목록 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'chatRoom', ChatRoomDto, {
      isArray: true,
    }),
  );
}
