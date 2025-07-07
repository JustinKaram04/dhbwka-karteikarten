import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity } from 'typeorm'; // typorm-stuff
import { Topic } from './Topic';// topic-entity für relation
import { Flashcard } from './Flashcard'; // flashcard-entity für relation

@Entity() // markiert die klasse als tabelle in der db
export class Subtopic extends BaseEntity { // extends BaseEntity für save()/remove()
  @PrimaryGeneratedColumn() 
  id!: number // auto-id, primary key

  @Column() 
  name!: string // name vom subtopic,darf nicht leer sein

  @Column({ default: '' }) 
  description!: string // kurze beschreibung default leerstring wenn nix mitgegeben

  @ManyToOne(
    () => Topic,// jede subtopic gehört zu nem topic
    topic => topic.subtopics,
    { onDelete: 'CASCADE' } // löscht hier auch automatisch alle subtopics wenn topic gelöscht wird
  )
  topic!: Topic

  @OneToMany(
    () => Flashcard,// eine subtopic kann viele flashcards haben
    fc => fc.subtopic
  )
  flashcards!: Flashcard[] // array von karten die zu diesem subtopic gehören
}
