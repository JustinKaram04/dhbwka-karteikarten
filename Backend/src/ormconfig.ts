import { DataSource } from 'typeorm';
import 'reflect-metadata';
import { User } from './entity/User';
import { Topic } from './entity/Topic';
import { Subtopic } from './entity/Subtopic';
import { Flashcard } from './entity/Flashcard';

//konfiguration für typeorm-datasource
export const AppDataSource = new DataSource({
  type: 'mysql',  //db typ : mysql
  host: process.env.DB_HOST, //db host aus env
  port: parseInt(process.env.DB_PORT!),  //db port aus env
  username: process.env.DB_USER, //db benutzername
  password: process.env.DB_PASS,  //db passwort
  database: process.env.DB_NAME,  //datenbankname
  entities: [User, Topic, Subtopic, Flashcard], //tabellen definitionen
  synchronize: true,  //schema automatisch syncron halten (nur dev)
});