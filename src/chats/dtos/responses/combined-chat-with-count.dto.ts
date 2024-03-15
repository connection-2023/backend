import { ApiProperty } from '@nestjs/swagger';
import { ChatsDto } from '@src/common/dtos/chats.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class CombinedChatWithCountDto {
  @Expose()
  @ApiProperty({ description: '채팅', type: [ChatsDto] })
  @Type(() => ChatsDto)
  chats?: ChatsDto[];

  @Expose()
  @ApiProperty({ description: '전체 채팅 수', type: Number })
  totalItemCount: number;

  constructor(chatsResult: Partial<ChatsDto[]>, count: number) {
    this.chats = chatsResult
      ? chatsResult.map((chat) => new ChatsDto(chat))
      : undefined;
    this.totalItemCount = count;
    Object.assign(this);
  }
}
