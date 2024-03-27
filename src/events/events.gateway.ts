import { Inject } from '@nestjs/common';
import { ChatsRepository } from './../chats/repositories/chats.repository';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ValidateResult } from '@src/common/interface/common-interface';
import { Server, Socket } from 'socket.io';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisClientType } from 'redis';
import { InjectModel } from '@nestjs/mongoose';
import { OnlineMap } from './schemas/online-map.schema';
import { Model } from 'mongoose';
import { generateCurrentTime } from '@src/common/utils/generate-current-time';

@WebSocketGateway({ namespace: /\/chatroom\d+/ })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectModel(OnlineMap.name)
    private readonly onlineMapModel: Model<OnlineMap>,
  ) {}

  @WebSocketServer() public server: Server;

  @SubscribeMessage('login')
  async handleLogin(
    @MessageBody()
    data: {
      authorizedData: { userId?: number; lecturerId?: number };
      rooms: string[];
    },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('login', data.authorizedData);

    const socketId = socket.id;
    console.log('socketId', socketId);

    data.rooms.forEach((room) => {
      console.log('join', room);
      socket.join(room);
    });

    const joinUser = await this.onlineMapModel.findOneAndUpdate(
      { ...data.authorizedData },
      { lastLogin: null, socketId },
      { upsert: true, new: true },
    );

    socket.nsp.emit('joinUser', joinUser);
  }

  afterInit(server: Server): any {
    console.log('init');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('connected', socket.nsp.name);
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconnected', socket.nsp.name);

    const socketId = socket.id;

    const exitUser = await this.onlineMapModel.findOneAndUpdate(
      { socketId },
      { lastLogin: new Date() },
      { new: true },
    );

    socket.nsp.emit('exitUser', exitUser);
  }
}
