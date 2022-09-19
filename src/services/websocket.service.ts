import { Server, WebSocket } from 'ws';
import { createServer } from 'http';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer as NestWebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway(81, { transports: ['websocket'] })
export class WebsocketService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @NestWebSocketServer() websocketServer: Server;
  constructor() {}
  handleConnection(client: WebSocket, ...args: any[]) {
    console.log(`Client connected: ${client}`);
  }
  handleDisconnect(client: WebSocket) {
    console.log(`Client disconnected: ${client}`);
  }
  afterInit(server: Server) {
    console.log('Initialized');
    this.websocketServer.path = '/websocket';
  }

  async sendEvent(event: string) {
    this.websocketServer.clients.forEach((client) => {
      client.send('test');
    });
  }
}
