import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entity/User';

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  //token entweder aus httponly-coockie oder authorization header holen wenn httponly-coocke leer ist
  const token = req.cookies.auth || req.header('Authorization')?.split(' ')[1];
  if (!token) {
    //kein token 401 unauthotized
    res.status(401).end();
    return;
  }

  try {
    //token verifizieren (JWT_SEVRET aus env)
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    //payload.sub ist die user-id als sting also umwandeln
    const userId = parseInt(payload.sub as string, 10);
    //user in db nach id suchen
    const user   = await User.findOne({ where: { id: userId } });
    if (!user) {
      //kein user gefunden 401 unauthorized
      res.status(401).end();
      return;
    }
    //gefundenen user ins request objekt schreiben für spätere controller
    (req as any).user = user;
    next(); //authentifizierung erfolgreich, nächste middleware
  } catch {
    //bei fehler 401
    res.status(401).end();
  }
}
