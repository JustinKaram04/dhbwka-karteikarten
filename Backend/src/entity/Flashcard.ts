import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from 'typeorm';
import { Subtopic } from './Subtopic';

@Entity()
export class Flashcard extends BaseEntity {
  @PrimaryGeneratedColumn()   // automatisch INT
  id!: number;

  @Column()
  question!: string;

  @Column()
  answer!: string;

  @Column({ default: false })
  istoggled!: boolean;

  @Column({ default: 0 })
  learningProgress!: number;

  @ManyToOne(() => Subtopic, subtopic => subtopic.flashcards, { onDelete: 'CASCADE' })
  subtopic!: Subtopic;
}
