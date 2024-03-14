import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { DetailResponseDto } from '@src/common/swagger/dtos/detail-response-dto';
import { GetSocketRoomIdDto } from '../dtos/get-socket-room-id.dto';
import { GeneralResponseDto } from '@src/common/swagger/dtos/general-response.dto';
import { OnlineListDto } from '../dtos/chat-room-header.dto';

export function ApiGetOnlineList() {
  return applyDecorators(
    ApiOperation({
      summary: '채팅방 현활 조회',
    }),
    DetailResponseDto.swaggerBuilder(
      HttpStatus.OK,
      'onlineList',
      OnlineListDto,
    ),
  );
}
