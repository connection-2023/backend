import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
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
import { PrismaService } from '@src/prisma/prisma.service';
import { Cache } from 'cache-manager';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: /\/chatroom\d+/ })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prismaService: PrismaService,
  ) {}

  @WebSocketServer() public server: Server;

  @SubscribeMessage('login')
  async handleLogin(
    @MessageBody() data: { authorizedData: ValidateResult; rooms: string[] },
    @ConnectedSocket() socket: Socket,
  ) {
    const rooms = data.rooms;
    const newNamespace = socket.nsp;

    console.log('login', data.authorizedData);

    newNamespace.emit('onlineList');

    const key =
      data.authorizedData.tokenType === 'Lecturer'
        ? `onlineMap:lecturerId:${data.authorizedData.lecturer.id}`
        : `onlineMap:userId:${data.authorizedData.user.id}`;
    await this.cacheManager.set(key, data.authorizedData, 0);
    rooms.forEach((room: string) => {
      console.log('join', room);
      socket.join(`${room}`);
    });
  }

  afterInit(server: Server): any {
    console.log('init');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('connected', socket.nsp.name);
    socket.on('newChat', (message) => {
      console.log('Received new chat message:', message);
    });
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconnected', socket.nsp.name);
  }

  // private async scanKeys(cursor: string, pattern: string): Promise<string[]> {
  //   // const result = await this.cacheManager.scan(cursor, 'MATCH', pattern);

  //   const keys = result[1];

  //   if (result[0] === '0') {
  //     return keys;
  //   } else {
  //     const nextKeys = await this.scanKeys(result[0], pattern);
  //     return keys.concat(nextKeys);
  //   }
  // }
}
