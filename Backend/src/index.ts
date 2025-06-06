import topicsRouter from './routes/content.routes'; //router für /api/topics
import 'reflect-metadata';  //nötig für typeorm
import express from 'express';  //express instanz
import helmet from 'helmet';  //sicherheits middleware
import cors from 'cors';  //cross-orgin resource sharing
import cookieParser from 'cookie-parser'; //zum auslesen con cockies
import 'dotenv/config'; //lädt umgebungsvariable aus .env
import { AppDataSource } from './ormconfig';  //typeorm datenquelle
import authRoutes from './routes/auth.routes'; //router für /api/auth
import { authenticate } from './middleware/authenticate'; //auth middleware

const app = express();

//fügt Sicherheits header hinzu
app.use(helmet());

app.use(cors({
  origin: 'http://localhost:4200',  //Angular frontend
  credentials: true //coockies und authorisierungs header zulassen
}));

//json body payloads parsen
app.use(express.json());

//parsed httponlycookies
app.use(cookieParser());

AppDataSource.initialize()
  .then(() => {    //db verbindung erfolgreich

    //alle auth routen uner /api/auth
    app.use('/api/auth', authRoutes);

    //crud für topics/subtopics/flashcards under api/topics
    app.use('/api/topics', topicsRouter);

    //server starten port aus .env oder 3100
    app.listen(process.env.PORT || 3100, () =>
      console.log(`Server läuft auf Port ${process.env.PORT || 3100}`)
    );
  })
  //falls db verbindung scheitert fehle ausgeben
  .catch(err => console.error('DB-Verbindung fehlgeschlagen', err));

