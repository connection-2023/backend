import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatsService } from './../services/chats.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { CreateChatsDto } from '../dtos/create-chats.dto';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { ParseObjectIdPipe } from '@src/common/validator/parse-object-id.pipe';
import mongoose from 'mongoose';
import { ApiCreateChat } from '../swagger-decorators/create-chat-decorator';
import { ApiGetChatsWithChatRoomId } from '../swagger-decorators/get-chat-with-chat-room-id.decorator';
import { ApiUpdateUnreadMessage } from '../swagger-decorators/update-unread-message.decorator';
import { GetPageTokenQueryDto } from '../dtos/get-page-token.query.dto';
import { AllowUserAndLecturerGuard } from '@src/common/guards/allow-user-lecturer.guard';
import { ApiChats } from './swagger/chats.swagger';

@ApiTags('채팅')
// @UseInterceptors(MongooseClassSerializerInterceptor(Chats))
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @ApiCreateChat()
  @SetResponseKey('chat')
  @UseGuards(AllowUserAndLecturerGuard)
  @Post()
  async createChats(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createChatsDto: CreateChatsDto,
  ) {
    return await this.chatsService.createChats(authorizedData, createChatsDto);
  }

  @ApiGetChatsWithChatRoomId()
  @Get('chat-rooms/:chatRoomId')
  async getChats(
    @Query() query: GetPageTokenQueryDto,
    @Param('chatRoomId', ParseObjectIdPipe) chatRoomId: mongoose.Types.ObjectId,
  ) {
    return await this.chatsService.getChatsWithChatRoomId(query, chatRoomId);
  }

  @ApiUpdateUnreadMessage()
  @Patch('chat-rooms/:chatRoomId')
  async updateUnreadMessage(
    @Param('chatRoomId', ParseObjectIdPipe) chatRoomId: mongoose.Types.ObjectId,
  ) {
    return await this.chatsService.updateUnreadMessage(chatRoomId);
  }

  @ApiChats.CountTotalUnreadMessage({ summary: '안읽은 채팅 전체 수 조회' })
  @SetResponseKey('totalUnreadCount')
  @UseGuards(AllowUserAndLecturerGuard)
  @Get('total-unread-count')
  async countTotalUnreadMessage(
    @GetAuthorizedUser() authorizedData: ValidateResult,
  ) {
    return await this.chatsService.countTotalUnreadMessage(authorizedData);
  }
}
