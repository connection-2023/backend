import { ValidateResult } from '@src/common/interface/common-interface';
import { ChatRoomRepository } from './../repositories/chats-room.repository';
import { Injectable } from '@nestjs/common';
import { GetSocketRoomIdDto } from '../dtos/get-socket-room-id.dto';

@Injectable()
export class ChatRoomService {
  constructor(private readonly chatRoomRepository: ChatRoomRepository) {}

  async getSocketRoom(authorizedData: ValidateResult) {
    const where = authorizedData.user
      ? { userId: authorizedData.user.id }
      : { lecturerId: authorizedData.lecturer.id };

    const rooms = await this.chatRoomRepository.getRoomById(where);

    return rooms.map((room) => new GetSocketRoomIdDto(room));
  }
}
