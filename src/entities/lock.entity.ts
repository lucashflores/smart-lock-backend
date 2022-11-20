import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm';
import { UserLockRelation } from './user-lock-relation.entity';

@Entity({ name: 'locks' })
export class Lock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'command_hash' })
  commandHash: string;

  @Column()
  websocket: string;

  @OneToMany((type) => UserLockRelation, (relation) => relation.lock)
  relations?: UserLockRelation[];
}
