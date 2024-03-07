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

@WebSocketGateway({ namespace: /\/chatroom\d+/ })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

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

    const key = `onlineMap:${socket.id}`;
    const value = data.authorizedData.lecturerId
      ? { lecturerId: data.authorizedData.lecturerId }
      : { userId: data.authorizedData.userId };

    await this.cacheManager.set(key, value, 0);

    data.rooms.forEach((room) => {
      console.log('join', room);
      socket.join(room);
    });

    const onlineMapKeys = await this.cacheManager.store.keys('onlineMap:*');

    const onlineMap = await this.cacheManager.store.mget(...onlineMapKeys);

    socket.nsp.emit('onlineMap', onlineMap);
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

    const onlineMapKeys = await this.cacheManager.store.keys('onlineMap:*');

    const onlineMap = await this.cacheManager.store.mget(...onlineMapKeys);

    socket.nsp.emit('onlineMap', onlineMap);
  }
}
