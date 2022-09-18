import { WebSocketServer } from 'ws';
import { createServer } from 'http';

export class WebsocketService {
  private websocketServer: WebSocketServer;
  constructor() {
    this.websocketServer = new WebSocketServer({ server: createServer() });
  }

  async sendEvent(event: string) {
    this.websocketServer.on('connection', function connection(webSocket) {
      webSocket.send(event);
    });
  }
}
