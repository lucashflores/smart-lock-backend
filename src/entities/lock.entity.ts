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
@Unique(['name'])
export class Lock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  websocket: string;

  @OneToMany((type) => UserLockRelation, (relation) => relation.lock, {
    cascade: ['remove'],
  })
  relations?: UserLockRelation[];
}
