import { Request, Response, NextFunction } from 'express';// express-typen fürs req/res/next
import jwt from 'jsonwebtoken';// jsonwebtoken lib fürs token verifizieren
import { User } from '../entity/User';// user-entity, um user aus der db zu holen
import { env } from '../config/config';// env-variablen (z.b. secret)

// modul-augmentation:sagt express dass req.user optional vom typ User ist
declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  //versuch token aus cookie auth zu holen sonst aus header "Authorization: Bearer <token>"
  const token = req.cookies.auth ?? req.header('Authorization')?.split(' ')[1];
  if (!token) {
    // kein token gefunden = 401 unauthorized
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    // token verifizieren mit secret payload enthält hier mindestens sub (user id)
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as { sub: string };
    const userId = parseInt(payload.sub, 10); //sub ist string also parseInt

    //schau in der db ob user mit der id existiert
    const user = await User.findOneBy({ id: userId });
    if (!user) {
      // token zwar ok aber user gibts nicht mehr = auch 401
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    //falls alles passt pack user in req.user damit nachgelagerte middleware drauf zugreifen kann
    req.user = user;
    next(); //weiter zur nächsten middleware / route-handler
  } catch (err) {
    // falls jwt.verify wirft (z.b. expired oder ungültig) = gib fehler an express weiter
    next(err);
  }
};