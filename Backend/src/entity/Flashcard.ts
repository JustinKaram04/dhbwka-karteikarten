import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from 'typeorm'; //typorm-stuff holen
import { Subtopic } from './Subtopic'; //subtopic-entity import für relation

@Entity() //sagt typeorm, das wird ne tabelle in der db
export class Flashcard extends BaseEntity { // extends BaseEntity damit save()/remove() direkt gehen
  @PrimaryGeneratedColumn()
  id!: number // auto-increment id primary key für jede karte

  @Column()
  question!: string //text der frage darf nix-wichtiger sein

  @Column()
  answer!: string //text der antwort dazu beim lernen

  @Column({ default: false })
  isToggled!: boolean // flag ob karte grad umgedreht/aufgedeckt is default false

  @Column({ default: 0 })
  learningProgress!: number // zähler für lern-fortschritt default 0

  @ManyToOne(() => Subtopic, sub => sub.flashcards, { onDelete: 'CASCADE' }) 
  subtopic!: Subtopic// relation: jede karte gehört zu nem subtopic, löscht man subtopic, werden karten mit gelöscht
}
