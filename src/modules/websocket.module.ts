import { Module } from '@nestjs/common';
import { WebsocketService } from 'src/services/websocket.service';

@Module({
  providers: [WebsocketService],
})
export class WebsocketModule {}
