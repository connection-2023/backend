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

    const onlineMapKeys = await this.findKeysByOnlineMap();
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

    await this.cacheManager.del(`onlineMap:${socket.id}`);

    const onlineMapKeys = await this.findKeysByOnlineMap();

    const onlineMap = await this.cacheManager.store.mget(...onlineMapKeys);

    socket.nsp.emit('onlineMap', onlineMap);
  }

  async findKeysByOnlineMap(): Promise<string[]> {
    const keys: string[] = await this.cacheManager.store.keys();
    const onlineMapKeys: string[] = keys.filter((key) =>
      key.startsWith('onlineMap:'),
    );
    return onlineMapKeys;
  }
}
