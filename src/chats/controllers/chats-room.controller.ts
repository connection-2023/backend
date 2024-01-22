import { ApiTags } from '@nestjs/swagger';
import { ChatRoomService } from './../services/chats-room.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiGetSocketRoom } from '../swagger-decorators/get-scoket-room-id.decorator';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { AccessTokenGuard } from '@src/common/guards/access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';

@Controller('chat-rooms/:id')
@ApiTags('채팅방')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @SetResponseKey('rooms')
  @ApiGetSocketRoom()
  @UseGuards(AccessTokenGuard)
  @Get('sockets')
  async getSocketRoom(@GetAuthorizedUser() authorizedData: ValidateResult) {
    return await this.chatRoomService.getSocketRoom(authorizedData);
  }
}
