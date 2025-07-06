import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity } from 'typeorm';
import { User } from './User';
import { Subtopic } from './Subtopic';

@Entity()
export class Topic extends BaseEntity {
  @PrimaryGeneratedColumn() id!: number;
  @Column() name!: string;
  @Column({ default: '' }) description!: string;
  @ManyToOne(() => User, user => user.topics, { onDelete: 'CASCADE' }) owner!: User;
  @OneToMany(() => Subtopic, sub => sub.topic) subtopics!: Subtopic[];
}