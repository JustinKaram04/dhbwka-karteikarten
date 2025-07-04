import { Router, Request, Response } from 'express';
const { body, validationResult } = require('express-validator');
import jwt from 'jsonwebtoken'; //für JWT Token erstellung
import { User } from '../entity/User';  //typeORM Entity für user
import * as argon2 from 'argon2';//zum hashen von passwörtern

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET!; //secret aus umgebungsvariable

//regestrierung
router.post(
  '/register',
  body('username').isLength({ min: 3 }),  //username mindestens 3 zeichen
  body('email').isEmail(),  //gültige mail
  body('password').isLength({ min: 8 }),  //passwort mindestens 8 zeichen
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //wenn validierungsfehler 400 mit details
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const { username, email, password } = req.body;
    //prüfen ob username oder email bereits exestiert
    const existing = await User.findOne({
      where: [
        { username: username },
        { email:    email }
      ]
    });
    if (existing) {
      res.status(409).json({ error: 'Username or Email already taken.' });
      return;
    }
    //passwort hashen mit salt-round 12
    const passwordHash = await argon2.hash(password);
    //neuen user erstellen uns speichern
    const user = User.create({ username, email, passwordHash });
    await user.save();
    //201 created + user daten (ohne passwort)
    res.status(201).json({ id: user.id, username: user.username, email: user.email });
  }
);

//login
router.post(
  '/login',
  body('username').notEmpty(),  //usaername darf nicht leer sein
  body('password').notEmpty(),  //passwort darf nicht leer sein
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //valierunsfehler 400 bad request
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const { username, password } = req.body;
    // user anhand username ODER email suchen
    const user = await User.findOne({
      where: [
        { username: username },
        { email:    username }
      ]
    });
    if (!user) {
      // kein solcher user 401 unauthorized
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }
    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) {
      //passwort prüfen hash vergleich
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }
    //JWT-Token erstellen, 1 stunde gültig
    const token = jwt.sign({ sub: user.id.toString(), username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    //token in httpponly-cookie setzen + token im body zurückgeben
    res
      .cookie('auth', token, { httpOnly: true, secure: true, maxAge: 3600000 })
      .json({ token });
  }
);

export default router;
