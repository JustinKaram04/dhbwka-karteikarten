import 'dotenv/config'; // dotenv schohn beim import automatisch env-vars laden
import dotenv from 'dotenv'; // optional import, config nochmal manuell triggern
dotenv.config(); // sicherheitshalber nochmal .env laden

import express from 'express'; // express framework holen
import 'reflect-metadata'; // für typeorm meta-daten
import cors from 'cors'; // cors middlware
import helmet from 'helmet'; // helmet setzt sicherheits-header
import cookieParser from 'cookie-parser'; // cookies aus req auslesen
import { AppDataSource } from './ormconfig'; // typeorm datasource config
import authRoutes from './routes/auth.routes'; // auth-routen
import topicsRoutes from './routes/topics.routes'; // topic-routen
import { errorHandler } from './middleware/errorHandler'; // zentraler fehler-händler
import { env } from './config/config'; // env variablen
const app = express(); // express instanz

app.use(helmet()); // sicherheits header vor allen routen
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true })); // frontend url erlaubt
app.use(express.json()); // json body parser
app.use(cookieParser()); // cookie parser middleware

AppDataSource.initialize() // datenbank verbindung starten
  .then(() => {
    app.use('/api/auth', authRoutes); // /api/auth routen
    app.use('/api/topics', topicsRoutes); // /api/topics routen

    app.use(errorHandler); // error handler middleware immer am schluss

    app.listen(env.PORT, () =>
      console.log(`Server läuft auf Port ${env.PORT}`)
    ); // server starten
  })
  .catch(err => console.error('DB-Verbindung fehlgeschlagen', err)); // fehler bei db verbindung loggen
