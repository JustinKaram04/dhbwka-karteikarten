import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import argon2 from 'argon2';
import { User } from '../entity/User';
import { env } from '../config/config';
import { z, ZodSchema } from 'zod';

//schema für register body user, email, pw
const registerSchema = z.object({
  username: z.string().min(3, { message: 'Username muss mindestens 3 Zeichen lang sein' }),
  email:    z.string().email({ message: 'Ungültige E-Mail-Adresse' }),
  password: z.string().min(8, { message: 'Passwort muss mindestens 8 Zeichen lang sein' })
});

//schema für login: user und pw dürfen nicht leer sein
const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username darf nicht leer sein' }),
  password: z.string().min(1, { message: 'Passwort darf nicht leer sein' })
});

// helper: nimmt ein zod schema und validiert req.body damit
function validateBody(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      //wenn validation failed,bauen wir fehlerobjekt
      const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[]>;
      const errors = Object.entries(fieldErrors).flatMap(
        ([param, msgs]) => msgs.map((msg: string) => ({ param, msg }))
      );
      res.status(400).json({ errors });//400 mit details
      return;
    }
    // validsetzen gefilterte daten zurück ins body
    req.body = result.data;
    next();
  };
}

//export middleware arrays damit express router es nutzen kann
export const registerValidator = [validateBody(registerSchema)];
export const loginValidator    = [validateBody(loginSchema)];

// registrieren eines users
export async function register(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body;
  // check ob user schon existiert (username oder email)
  const existing = await User.findOne({ where: [{ username }, { email }] });
  if (existing) {
    res.status(409).json({ error: 'Username oder E-Mail bereits vergeben.' });
    return;
  }
  //pw hashen mit argon2
  const passwordHash = await argon2.hash(password);
  //user entity erstellen
  const user = User.create({ username, email, passwordHash });
  await user.save();//speichern in db
  //danken mit user infos (ohne pw)
  res.status(201).json({ id: user.id, username: user.username, email: user.email });
}

// login funktion
export async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;
  //username kann auch email sein daher or
  const user = await User.findOne({ where: [{ username }, { email: username }] });
  if (!user) {
    res.status(401).json({ error: 'Ungültige Anmeldedaten.' });
    return;
  }
  //pw checken
  const valid = await argon2.verify(user.passwordHash, password);
  if (!valid) {
    res.status(401).json({ error: 'Ungültige Anmeldedaten.' });
    return;
  }

  const secret: Secret = env.JWT_ACCESS_SECRET; //holen das secret aus env
  const expiresInSeconds: number = env.ACCESS_TOKEN_EXP; //expire von env
  const options: SignOptions = { expiresIn: expiresInSeconds };

  //token signe mit payload sub als id
  const token = jwt.sign(
    { sub: user.id.toString(), username: user.username },
    secret,
    options
  );

  //setzen cookie und json antwort
  res
    .cookie('auth', token, {
      httpOnly: true,
      secure: true, // nur https
      maxAge: expiresInSeconds * 1000, // in ms
    })
    .json({ token });
}
