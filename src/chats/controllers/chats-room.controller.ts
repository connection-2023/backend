import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatRoomService } from './../services/chats-room.service';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiGetSocketRoom } from '../swagger-decorators/get-scoket-room-id.decorator';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { AccessTokenGuard } from '@src/common/guards/access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { CreateChatRoomDto } from '../dtos/create-chat-room.dto';
import { ApiCreateChatRoom } from '../swagger-decorators/create-chat-room.decorator';
import { ApiGetChatRoom } from '../swagger-decorators/get-chat-room.decorator';
import { ApiGetMyChatRoom } from '../swagger-decorators/get-my-chat-room.decorator';

@Controller('chat-rooms')
@ApiTags('채팅방')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @ApiGetSocketRoom()
  @UseGuards(AccessTokenGuard)
  @Get('socket-rooms')
  async getSocketRoom(@GetAuthorizedUser() authorizedData: ValidateResult) {
    return await this.chatRoomService.getSocketRoom(authorizedData);
  }

  @ApiCreateChatRoom()
  @UseGuards(AccessTokenGuard)
  @Post()
  async createChatRoom(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createChatRoomDto: CreateChatRoomDto,
  ) {
    return await this.chatRoomService.createChatRoom(
      authorizedData,
      createChatRoomDto,
    );
  }

  @SetResponseKey('chatRoom')
  @ApiGetChatRoom()
  @UseGuards(AccessTokenGuard)
  @Get('targets/:targetId')
  async getChatRoom(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('targetId', ParseIntPipe) targetId: number,
  ) {
    return await this.chatRoomService.getChatRoom(authorizedData, targetId);
  }

  @SetResponseKey('chatRoom')
  @ApiGetMyChatRoom()
  @UseGuards(AccessTokenGuard)
  @Get()
  async getMyChatRooms(@GetAuthorizedUser() authorizedData: ValidateResult) {
    return await this.chatRoomService.getMyChatRoom(authorizedData);
  }
}
