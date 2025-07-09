import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { Topic } from './Topic';
import { Todo } from './Todo';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() id!: number;

  @Column({ unique: true }) username!: string;

  @Column({ unique: true }) email!: string;

  @Column() passwordHash!: string;

  @OneToMany(() => Topic, topic => topic.owner)
  topics!: Topic[];

  @OneToMany(() => Todo, todo => todo.user)
  todos!: Todo[];
}
