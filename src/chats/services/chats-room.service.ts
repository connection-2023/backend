import { ValidateResult } from '@src/common/interface/common-interface';
import { ChatRoomRepository } from './../repositories/chats-room.repository';
import { Injectable } from '@nestjs/common';
import { GetSocketRoomIdDto } from '../dtos/get-socket-room-id.dto';
import { CreateChatRoomDto } from '../dtos/create-chat-room.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChatRoomService {
  constructor(private readonly chatRoomRepository: ChatRoomRepository) {}

  async getSocketRoom(authorizedData: ValidateResult) {
    const where = authorizedData.user
      ? { userId: authorizedData.user.id }
      : { lecturerId: authorizedData.lecturer.id };

    const rooms = await this.chatRoomRepository.getSocketRoom(where);

    return new GetSocketRoomIdDto(rooms);
  }

  async createChatRoom(
    authorizedData: ValidateResult,
    { targetId }: CreateChatRoomDto,
  ) {
    let userId: number;
    let lecturerId: number;
    const roomId = uuidv4();

    if (authorizedData.user) {
      userId = authorizedData.user.id;
      lecturerId = targetId;
    } else {
      userId = targetId;
      lecturerId = authorizedData.lecturer.id;
    }

    return await this.chatRoomRepository.createChatRoom(
      userId,
      lecturerId,
      roomId,
    );
  }
}
