import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import mongoose from 'mongoose';

@Exclude()
export class ChatsDto {
  _id?: mongoose.Types.ObjectId;

  @Expose()
  @ApiProperty({
    description: 'sender',
    type: Object,
    example: { userId: 1, lecturerId: null },
  })
  sender: { userId: number | null; lecturerId: number | null };

  @Expose()
  @ApiProperty({
    description: 'receiver',
    type: Object,
    example: { userId: null, lecturerId: 14 },
  })
  receiver: { userId: number | null; lecturerId: number | null };

  @Expose()
  @ApiProperty({ description: '내용' })
  content: string;

  @Expose()
  @ApiProperty({ description: '읽음 여부', type: Date })
  readedAt: Date;

  @Expose()
  @ApiProperty({ description: '보낸시간', type: Date })
  createdAt?: Date;

  constructor(chat: ChatsDto) {
    this.sender = chat.sender;
    this.receiver = chat.receiver;
    this.content = chat.content;
    this.readedAt = chat.readedAt;
    this.createdAt = chat.createdAt;

    Object.assign(this);
  }
}
