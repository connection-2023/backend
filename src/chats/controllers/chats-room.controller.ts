import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatRoomService } from './../services/chats-room.service';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiGetSocketRoom } from '../swagger-decorators/get-scoket-room-id.decorator';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { CreateChatRoomDto } from '../dtos/create-chat-room.dto';
import { ApiCreateChatRoom } from '../swagger-decorators/create-chat-room.decorator';
import { ApiGetChatRoom } from '../swagger-decorators/get-chat-room.decorator';
import { ApiGetMyChatRoom } from '../swagger-decorators/get-my-chat-room.decorator';
import { AllowUserAndLecturerGuard } from '@src/common/guards/allow-user-lecturer.guard';
import { ParseObjectIdPipe } from '@src/common/validator/parse-object-id.pipe';
import mongoose from 'mongoose';
import { ApiChatRoom } from './swagger/chats.swagger';

@Controller('chat-rooms/:id')
@ApiTags('채팅방')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @ApiGetSocketRoom()
  @UseGuards(AllowUserAndLecturerGuard)
  @Get('socket-rooms')
  async getSocketRoom(@GetAuthorizedUser() authorizedData: ValidateResult) {
    return await this.chatRoomService.getSocketRoom(authorizedData);
  }

  @SetResponseKey('chatRoom')
  @ApiCreateChatRoom()
  @UseGuards(AllowUserAndLecturerGuard)
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
  @UseGuards(AllowUserAndLecturerGuard)
  @Get('targets/:targetId')
  async getChatRoom(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('targetId', ParseIntPipe) targetId: number,
  ) {
    return await this.chatRoomService.getChatRoom(authorizedData, targetId);
  }

  @SetResponseKey('chatRoom')
  @ApiGetMyChatRoom()
  @UseGuards(AllowUserAndLecturerGuard)
  @Get()
  async getMyChatRooms(@GetAuthorizedUser() authorizedData: ValidateResult) {
    return await this.chatRoomService.getMyChatRoom(authorizedData);
  }

  @SetResponseKey('updatedChatRoom')
  @ApiChatRoom.LeaveChatRoom({ summary: '채팅방 나가기' })
  @UseGuards(AllowUserAndLecturerGuard)
  @Patch()
  async leaveChatRoom(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId,
  ) {
    return await this.chatRoomService.leaveChatRoom(authorizedData, id);
  }
}
