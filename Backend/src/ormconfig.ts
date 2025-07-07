import { DataSource } from 'typeorm';// typorm datasouce, verbindet uns mit der db
import { env } from './config/config';// env-vars safe geparsed aus .env
import { User } from './entity/User';// entity für user-tabelle
import { Topic } from './entity/Topic';// entity für topics
import { Subtopic } from './entity/Subtopic';// entity für subtopics
import { Flashcard } from './entity/Flashcard';// entity für flashcards

export const AppDataSource = new DataSource({// neue datasource instanz anlegen
  type: 'mysql',// verwendete db: mysql
  host: env.DB_HOST,// hostname aus env
  port: env.DB_PORT,// port aus env (als number)
  username: env.DB_USER,// db-user
  password: env.DB_PASS,// passwort
  database: env.DB_NAME,// datenbank name
  entities: [User, Topic, Subtopic, Flashcard],// alle entities, die typeorm managen soll
  synchronize: true,// auto-sync schema, änderungen werden direkt übernommen
});
