import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { User } from '../entities/user.entity';
import { UserModule } from './user.module';
import { UserService } from 'src/services/user.service';
import { UserController } from 'src/controllers/user.controller';
import { LockController } from 'src/controllers/lock.controller';
import { LockService } from 'src/services/lock.service';
import { UserLockRelationService } from 'src/services/user-lock-relation.service';
import { UserLockRelation } from 'src/entities/user-lock-relation.entity';
import { Lock } from 'src/entities/lock.entity';
import { LockModule } from './lock.module';
import { UserLockRelationModule } from './user-lock-relation.module';
import { UserLockRelationController } from 'src/controllers/user-lock-relation.controller';
import { WebsocketModule } from './websocket.module';
import { WebsocketService } from 'src/services/websocket.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    LockModule,
    UserLockRelationModule,
    WebsocketModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './config/.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGHOST,
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      port: +process.env.PGPORT,
      entities: [User, Lock, UserLockRelation],
      database: process.env.PGDATABASE,
      schema: 'smart-lock',
      synchronize: false,
    }),
    TypeOrmModule.forFeature([User, Lock, UserLockRelation]),
    JwtModule.register({
      secret: process.env.SECRET,
    }),
  ],
  controllers: [
    AppController,
    UserController,
    LockController,
    UserLockRelationController,
  ],
  providers: [
    AppService,
    UserService,
    LockService,
    UserLockRelationService,
    WebsocketService,
  ],
})
export class AppModule {}
