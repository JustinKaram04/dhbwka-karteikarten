import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  text!: string;

  @Column({ default: false })
  done!: boolean;

  @ManyToOne(() => User, user => user.todos)
  user!: User;
}