import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity } from 'typeorm'; // typorm kram holen
import { User } from './User';// user-entity, damit wir owner zuweisen können
import { Subtopic } from './Subtopic'; // subtopic-entity für die relation

@Entity() // sagt typeorm: das wird ne tabelle in der db
export class Topic extends BaseEntity { // extends BaseEntity damit save()/remove() direkt gehen
  @PrimaryGeneratedColumn()
  id!: number // auto-increment pk jede topic kriegt ne eindeutige id

  @Column()
  name!: string // name vom topic darf nicht leer sein

  @Column({ default: '' })
  description!: string // kurze beschriebung default leerstr falls nix angegeben

  @ManyToOne(
    () => User,// jede topic gehört zu nem user
    user => user.topics,// inverse-seite: user.topics
    { onDelete: 'CASCADE' }// wenn user gelöscht wird löschen wir hier auch alle topics
  )
  owner!: User // der user, dem das topic gehört

  @OneToMany(
    () => Subtopic,// eine topic kann mehrere subtopics haben
    sub => sub.topic// inverse-seite sub.topic
  )
  subtopics!: Subtopic[] // array mit allen subtopics zu diesem topic
}
