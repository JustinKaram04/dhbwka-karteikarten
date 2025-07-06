import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity } from 'typeorm';
import { Topic } from './Topic';
import { Flashcard } from './Flashcard';

@Entity()
export class Subtopic extends BaseEntity {
  @PrimaryGeneratedColumn() id!: number;
  @Column() name!: string;
  @Column({ default: '' }) description!: string;
  @ManyToOne(() => Topic, topic => topic.subtopics, { onDelete: 'CASCADE' }) topic!: Topic;
  @OneToMany(() => Flashcard, fc => fc.subtopic) flashcards!: Flashcard[];
}