import { Server, WebSocketServer } from 'ws';
import { createServer } from 'http';
import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer as NestWebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway()
export class WebsocketService implements OnGatewayInit {
  @NestWebSocketServer() websocketServer: Server;
  constructor() {}
  afterInit(server: any) {
    console.log('Initialized');
    this.websocketServer.path = '/websocket';
  }

  async sendEvent(event: string) {
    console.log(this.websocketServer.path);
    this.websocketServer.emit(event);
  }
}
