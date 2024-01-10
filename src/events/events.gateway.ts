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
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: /\/chatroom\d+/ })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;

  @SubscribeMessage('login')
  handleLogin(
    @MessageBody() data: { userName: string; rooms: string[] },
    @ConnectedSocket() socket: Socket,
  ) {
    const userName = data.userName;
    const rooms = data.rooms;

    console.log('login', userName);

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
}
