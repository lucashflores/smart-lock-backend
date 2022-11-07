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

  @Column({ default: '' })
  fingerprint: string;

  @Column({ default: '' })
  face: string;

  @OneToMany((type) => UserLockRelation, (relation) => relation.user, {
    cascade: ['remove'],
  })
  relations?: UserLockRelation[];
}
