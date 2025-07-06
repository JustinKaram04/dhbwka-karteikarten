import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import argon2 from 'argon2';
import { User } from '../entity/User';
import { env } from '../config/config';
import { z, ZodSchema } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3, { message: 'Username muss mindestens 3 Zeichen lang sein' }),
  email:    z.string().email({ message: 'Ungültige E-Mail-Adresse' }),
  password: z.string().min(8, { message: 'Passwort muss mindestens 8 Zeichen lang sein' })
});

const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username darf nicht leer sein' }),
  password: z.string().min(1, { message: 'Passwort darf nicht leer sein' })
});

function validateBody(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[]>;
      const errors = Object.entries(fieldErrors).flatMap(
        ([param, msgs]) => msgs.map((msg: string) => ({ param, msg }))
      );
      res.status(400).json({ errors });
      return;
    }
    req.body = result.data;
    next();
  };
}

export const registerValidator = [validateBody(registerSchema)];
export const loginValidator    = [validateBody(loginSchema)];

export async function register(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body;
  const existing = await User.findOne({ where: [{ username }, { email }] });
  if (existing) {
    res.status(409).json({ error: 'Username oder E-Mail bereits vergeben.' });
    return;
  }
  const passwordHash = await argon2.hash(password);
  const user = User.create({ username, email, passwordHash });
  await user.save();
  res.status(201).json({ id: user.id, username: user.username, email: user.email });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;
  const user = await User.findOne({ where: [{ username }, { email: username }] });
  if (!user) {
    res.status(401).json({ error: 'Ungültige Anmeldedaten.' });
    return;
  }
  const valid = await argon2.verify(user.passwordHash, password);
  if (!valid) {
    res.status(401).json({ error: 'Ungültige Anmeldedaten.' });
    return;
  }

  const secret: Secret = env.JWT_ACCESS_SECRET;
  const expiresInSeconds: number = parseInt(env.ACCESS_TOKEN_EXP, 10);
  const options: SignOptions = { expiresIn: expiresInSeconds };

  const token = jwt.sign(
    { sub: user.id.toString(), username: user.username },
    secret,
    options
  );

  res
    .cookie('auth', token, { httpOnly: true, secure: true, maxAge: 3600000 })
    .json({ token });
}
