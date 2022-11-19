import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Lock } from './lock.entity';
import { User } from './user.entity';

@Entity({ name: 'user-lock-relations' })
export class UserLockRelation {
  @PrimaryColumn({ name: 'lock_id' })
  lockID: string;

  @PrimaryColumn({ name: 'user_id' })
  userID: string;

  @Column()
  owner: boolean;

  @ManyToOne((type) => Lock, (lock) => lock.relations, {
    cascade: ['remove'],
  })
  @JoinColumn({ name: 'lock_id' })
  lock?: Lock;

  @ManyToOne((type) => User, (user) => user.relations, {
    cascade: ['remove'],
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
