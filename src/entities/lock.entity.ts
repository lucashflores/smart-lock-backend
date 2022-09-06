import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'locks' })
@Unique(['name'])
export class Lock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'mac_address' })
  macAddress: string;

  @Column()
  websocket: string;
}
