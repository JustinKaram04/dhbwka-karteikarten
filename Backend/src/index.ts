import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import 'reflect-metadata';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppDataSource } from './ormconfig';
import authRoutes from './routes/auth.routes';
import topicsRoutes from './routes/topics.routes';
import { errorHandler } from './middleware/errorHandler';
import { env } from './config/config';
import todoRouter from './routes/todo.routes';




const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/todos', todoRouter);

AppDataSource.initialize()
  .then(() => {
    app.use('/api/auth',   authRoutes);
    app.use('/api/topics', topicsRoutes);

    // immer ganz am Schluss
    app.use(errorHandler);

    app.listen(env.PORT, () =>
      console.log(`Server läuft auf Port ${env.PORT}`)
    );
  })
  .catch(err => console.error('DB-Verbindung fehlgeschlagen', err));
