import { CreateChatsDto } from './../dtos/create-chats.dto';
import { ValidateResult } from '@src/common/interface/common-interface';
import { ChatsRepository } from './../repositories/chats.repository';
import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class ChatsService {
  constructor(private readonly chatsRepository: ChatsRepository) {}

  async createChats(
    authorizedData: ValidateResult,
    { receiverId, content, roomId }: CreateChatsDto,
  ) {
    const { sender, receiver } = this.createSenderAndReceiver(
      authorizedData,
      receiverId,
    );
    const roomObjectId = new mongoose.Types.ObjectId(roomId);

    await this.chatsRepository.createChats(
      sender,
      receiver,
      content,
      roomObjectId,
    );
  }

  private createSenderAndReceiver(
    authorizedData: ValidateResult,
    targetId: number,
  ) {
    const sender = {};
    const receiver = {};

    if (authorizedData.user) {
      sender['userId'] = authorizedData.user.id;
      receiver['lecturerId'] = targetId;
    } else {
      sender['lecturerId'] = authorizedData.user.id;
      receiver['userId'] = targetId;
    }

    return { sender, receiver };
  }
}
