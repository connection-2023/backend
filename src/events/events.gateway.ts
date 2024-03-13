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

    data.rooms.forEach((room) => {
      console.log('join', room);
      socket.join(room);
    });

    const onlineMapInputData = { ...data.authorizedData, socketId };

    await this.onlineMapModel.create(onlineMapInputData);

    socket.nsp.emit('joinUser', data.authorizedData);
  }

  afterInit(server: Server): any {
    console.log('init');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('connected', socket.nsp.name);
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconnected', socket.nsp.name);

    const exitUser = await this.cacheManager.get(`onlineMap:${socket.id}`);

    await this.cacheManager.del(`onlineMap:${socket.id}`);

    socket.nsp.emit('exitUser', exitUser);
  }
}
