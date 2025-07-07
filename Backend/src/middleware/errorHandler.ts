import { NextFunction, Request, Response } from 'express'; // express-typen für fehler-middleware

//middleware fürs abfangen und formatieren von fehlern
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err); // fehler in der konsole loggen damit man debuggen kann
  const status = err.status || 500; // wenn err.status gesetzt sonst 500 (internen serverfehler)
  const message = err.message || 'Internal Server Error'; // err.message oder fallback-text
  //antworte mit passendem status und json { error: nachricht }
  res.status(status).json({ error: message });
}

