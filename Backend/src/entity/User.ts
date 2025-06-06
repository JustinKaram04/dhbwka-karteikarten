import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from 'typeorm';
import { Topic } from './Topic';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()   // automatisch INT
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @OneToMany(() => Topic, topic => topic.owner)
  topics!: Topic[];
}
