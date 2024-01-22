import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { GetSocketRoomIdDto } from '../dtos/get-socket-room-id.dto';

export function ApiGetSocketRoom() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅방 소켓 룸 id 조회',
    }),
    ApiBearerAuth(),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'rooms',
      GetSocketRoomIdDto,
      { isArray: true },
    ),
  );
}
