import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user-lock-relations' })
export class UserLockRelation {
  @PrimaryColumn({ name: 'lock_id' })
  lockID: string;

  @PrimaryColumn({ name: 'user_id' })
  userID: string;

  @Column()
  owner: boolean;
}
