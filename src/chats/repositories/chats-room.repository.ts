import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Chats } from '../schemas/chats.schema';
import { ChatRoom } from '../schemas/chats-room.schema';
import { uuid } from 'aws-sdk/clients/customerprofiles';
import { ChatRoomDto } from '@src/common/dtos/chats-room.dto';
import { OnlineMap } from '@src/events/schemas/online-map.schema';
import { SenderAndReceiver } from '@src/common/dtos/chats.dto';

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
    try {
      const createdChatRoom = await this.chatRoomModel.create({
        user: { id: userId, participation: true },
        lecturer: { id: lecturerId, participation: true },
        roomId: roomId,
      });
      return createdChatRoom;
    } catch (error) {
      if (error.code === 11000 || error.code === 11001) {
        throw new ConflictException(
          'Duplicate key error. Please provide unique values.',
        );
      }
    }
  }

  async getChatRoom(userId: number, lecturerId: number): Promise<ChatRoom> {
    return await this.chatRoomModel.findOne({
      'user.id': userId,
      'lecturer.id': lecturerId,
    });
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
          user: { $last: '$user' },
          lecturer: { $last: '$lecturer' },
          roomId: { $last: '$roomId' },
          lastChat: { $last: '$lastChat' },
        },
      },
      {
        $project: {
          user: 1,
          lecturer: 1,
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
    receiver,
  ): Promise<number> {
    return await this.chatsModel.countDocuments({
      chattingRoomId,
      ...receiver,
      readedAt: null,
    });
  }

  async leaveChatRoom(
    chattingRoomId: mongoose.Types.ObjectId,
    updateData,
  ): Promise<ChatRoom> {
    return await this.chatRoomModel.findByIdAndUpdate(
      chattingRoomId,
      updateData,
      {
        new: true,
      },
    );
  }
}
