import { Server, WebSocket } from 'ws';
import { createServer } from 'http';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer as NestWebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway()
export class WebsocketService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private webSocket;
  private webSocketFactory;
  @NestWebSocketServer() websocketServer: Server;
  constructor() {
    this.webSocketFactory = {
      connectionTries: 3,
      connect: function (url) {
        var ws = new WebSocket(url);
        ws.addEventListener('error', (e) => {
          // readyState === 3 is CLOSED
          if (e.target.readyState === 3) {
            this.connectionTries--;

            if (this.connectionTries > 0) {
              setTimeout(() => this.connect(url), 5000);
            } else {
              throw new Error(
                'Maximum number of connection trials has been reached',
              );
            }
          }
        });
      },
    };
  }
  handleConnection(client: WebSocket, ...args: any[]) {
    console.log(`Client connected: ${client}`);
  }
  handleDisconnect(client: WebSocket) {
    console.log(`Client disconnected: ${client}`);
  }
  afterInit(server: Server) {
    console.log('Initialized');
    this.websocketServer.path = '/websocket';
    this.webSocket = this.webSocketFactory.connect(
      'ws://localhost:3000/websocket',
    );
  }

  async sendEvent(event: string) {
    console.log(this.websocketServer.path);
    this.websocketServer.emit('msgToClient', 'test');
  }
}
