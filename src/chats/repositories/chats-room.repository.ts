import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Chats } from '../schemas/chats.schema';
import { ChatRoom } from '../schemas/chats-room.schema';
import { uuid } from 'aws-sdk/clients/customerprofiles';
import { ChatRoomDto } from '@src/common/dtos/chats-room.dto';
import { OnlineMap } from '@src/events/schemas/online-map.schema';

@Injectable()
export class ChatRoomRepository {
  constructor(
    @InjectModel(Chats.name) private readonly chatsModel: Model<Chats>,
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: Model<ChatRoom>,
  ) {}

  async getSocketRoom(where): Promise<ChatRoomDto[]> {
    return await this.chatRoomModel.find(where);
  }

  async createChatRoom(
    userId: number,
    lecturerId: number,
    roomId: uuid,
  ): Promise<ChatRoom> {
    return await this.chatRoomModel.create({ userId, lecturerId, roomId });
  }

  async getChatRoom(userId: number, lecturerId: number): Promise<ChatRoom> {
    return await this.chatRoomModel.findOne({ userId, lecturerId });
  }

  async getChatRoomWithChatRoomId(
    chatRoomId: mongoose.Types.ObjectId,
  ): Promise<ChatRoom> {
    return await this.chatRoomModel.findById(chatRoomId);
  }

  async getMyChatRooms(where): Promise<ChatRoomDto[]> {
    return await this.chatRoomModel.aggregate([
      where,
      {
        $lookup: {
          from: 'chats',
          localField: '_id',
          foreignField: 'chattingRoomId',
          as: 'lastChat',
        },
      },
      {
        $unwind: { path: '$lastChat', preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: '$_id',
          userId: { $last: '$userId' },
          lecturerId: { $last: '$lecturerId' },
          roomId: { $last: '$roomId' },
          lastChat: { $last: '$lastChat' },
        },
      },
      {
        $project: {
          userId: 1,
          lecturerId: 1,
          roomId: 1,
          lastChat: 1,
        },
      },
      {
        $sort: {
          'lastChat.createdAt': -1,
        },
      },
    ]);
  }

  async countUnreadMessage(
    chattingRoomId: mongoose.Types.ObjectId,
  ): Promise<number> {
    return await this.chatsModel.countDocuments({
      chattingRoomId,
      readedAt: null,
    });
  }
}
