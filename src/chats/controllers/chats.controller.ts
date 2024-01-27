import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatsService } from './../services/chats.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '@src/common/guards/access-token.guard';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { CreateChatsDto } from '../dtos/create-chats.dto';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';

@ApiTags('채팅')
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @SetResponseKey('chat')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post()
  async createChats(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createChatsDto: CreateChatsDto,
  ) {
    return await this.chatsService.createChats(authorizedData, createChatsDto);
  }
}
