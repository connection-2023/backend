import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatsService } from './../services/chats.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccessTokenGuard } from '@src/common/guards/access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { CreateChatsDto } from '../dtos/create-chats.dto';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { ParseObjectIdPipe } from '@src/common/validator/parse-object-id.pipe';
import mongoose from 'mongoose';
import { GetChatsQueryDto } from '../dtos/get-chats.query.dto';
import MongooseClassSerializerInterceptor from '@src/common/interceptors/mongoose-class-serializer.interceptor';
import { ChatsDto } from '@src/common/dtos/chats.dto';
import { Chats } from '../schemas/chats.schema';
import { ApiCreateChat } from '../swagger-decorators/create-chat-decorator';
import { ApiGetChatsWithChatRoomId } from '../swagger-decorators/get-chat-with-chat-room-id.decorator';
import { ApiUpdateUnreadMessage } from '../swagger-decorators/update-unread-message.decorator';

@ApiTags('채팅')
// @UseInterceptors(MongooseClassSerializerInterceptor(Chats))
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @ApiCreateChat()
  @SetResponseKey('chat')
  @UseGuards(AccessTokenGuard)
  @Post()
  async createChats(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createChatsDto: CreateChatsDto,
  ) {
    return await this.chatsService.createChats(authorizedData, createChatsDto);
  }

  @ApiGetChatsWithChatRoomId()
  @SetResponseKey('chats')
  @Get('chat-rooms/:chatRoomId')
  async getChats(
    @Query() query: GetChatsQueryDto,
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
}
