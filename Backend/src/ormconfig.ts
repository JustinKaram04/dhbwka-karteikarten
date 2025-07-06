import { DataSource } from 'typeorm';
import { env } from './config/config';
import { User } from './entity/User';
import { Topic } from './entity/Topic';
import { Subtopic } from './entity/Subtopic';
import { Flashcard } from './entity/Flashcard';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  entities: [User, Topic, Subtopic, Flashcard],
  synchronize: true,
});
