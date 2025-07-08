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

<<<<<<< HEAD
  @Column({ unique: true })
  email!: string // unique email wird später fürs login genutzt

  @Column()
  passwordHash!: string //hier wird das gehashte passwort gespeichert nicht im klartext

  @OneToMany(
    () => Topic,
    topic => topic.owner
  )
  topics!: Topic[] //relation: ein user kann mehrere topics haben
=======
  @Column({ unique: true }) email!: string;

  @Column() passwordHash!: string;

  @OneToMany(() => Topic, topic => topic.owner)
  topics!: Topic[];

  @OneToMany(() => Todo, todo => todo.user)
  todos!: Todo[];
>>>>>>> main
}
