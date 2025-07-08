import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from 'typeorm'; // typorm kram import
import { Topic } from './Topic'; // topic-entity, damit user seine topics hat

@Entity() // markiert die klasse als table in der db
export class User extends BaseEntity { // extends BaseEntity für save()/remove() direkt benutzen
  @PrimaryGeneratedColumn()
  id!: number // auto-id primary key für jeden user

  @Column({ unique: true })
  username!: string // einzigartiger nutzername darf nicht doppelt sein

  @Column({ unique: true })
  email!: string // unique email wird später fürs login genutzt

  @Column()
  passwordHash!: string //hier wird das gehashte passwort gespeichert nicht im klartext

  @OneToMany(
    () => Topic,
    topic => topic.owner
  )
  topics!: Topic[] //relation: ein user kann mehrere topics haben
}
