import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity() // Markiert diese Klasse als Datenbank-Entity (Tabelle)
export class Todo {
  @PrimaryGeneratedColumn() // Automatisch generierte ID (Primärschlüssel)
  id!: number;

  @Column() // Einfaches Textfeld für die Beschreibung des Todos
  text!: string;

  @Column({ default: false }) // Boolean-Feld, das angibt, ob das Todo erledigt ist (Standard: false)
  done!: boolean;

  @ManyToOne(() => User, user => user.todos) // Viele Todos gehören zu einem Benutzer
  user!: User;
}