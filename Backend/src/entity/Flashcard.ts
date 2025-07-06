import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from 'typeorm';
import { Subtopic } from './Subtopic';

@Entity()
export class Flashcard extends BaseEntity {
  @PrimaryGeneratedColumn() id!: number;
  @Column() question!: string;
  @Column() answer!: string;
  @Column({ default: false }) isToggled!: boolean;
  @Column({ default: 0 }) learningProgress!: number;
  @ManyToOne(() => Subtopic, sub => sub.flashcards, { onDelete: 'CASCADE' }) subtopic!: Subtopic;
}