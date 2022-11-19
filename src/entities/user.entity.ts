import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserLockRelation } from './user-lock-relation.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @OneToMany((type) => UserLockRelation, (relation) => relation.user)
  relations?: UserLockRelation[];
}
