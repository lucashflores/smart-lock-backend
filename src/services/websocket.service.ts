import { Server, WebSocket } from 'ws';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer as NestWebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({ transports: ['websocket'] })
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
    this.websocketServer.setMaxListeners(50);
  }

  async sendUnlockEvent(commandHash: string) {
    this.websocketServer.clients.forEach((client) => {
      client.send(`unlock ${commandHash}`);
    });
  }
}
