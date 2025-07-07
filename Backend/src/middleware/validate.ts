import { Request, Response, NextFunction } from 'express'; // express-typen zum req/res/next
import { ZodSchema } from 'zod'; // zod-typen fürs schema

//helper-funktion, die errros sammelt und im richtigen format zurückgibt
function respondValidationErrors(res: Response, errors: Record<string,string[]>) {
  // flatten errors: aus { feld: [msgs] } mach array von { param, msg }
  const formatted = Object.entries(errors)
    .flatMap(([param, msgs]) =>
      msgs.map(msg => ({ param, msg }))
    );
  res.status(400).json({ errors: formatted }); //400 bad request mit error-array
}

// middleware: validiert req.body gegen ein zod-schema
export function validateBody(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    // versuch body zu parsen/validieren
    const result = schema.safeParse(req.body);
    if (!result.success) {
      // wenn zod errors hat flatten und filter msgs
      const fieldErrors = result.error.flatten().fieldErrors;
      const errors = Object.entries(fieldErrors)
        .filter(([, msgs]) => msgs && msgs.length > 0)
        .flatMap(([param, msgs]) =>
          msgs!.map(msg => ({ param, msg }))
        );
      return res.status(400).json({ errors });//zurück mit fehlern
    }
    // body ist vali überschreib request.body mit gecasteten daten
    req.body = result.data;
    next(); // weiter zur nächsten middleware/handler
  };
}

// middleware: validiert req.params gegen zod-schema
export function validateParams(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const errors = Object.entries(fieldErrors)
        .filter(([, msgs]) => msgs && msgs.length > 0)
        .flatMap(([param, msgs]) =>
          msgs!.map(msg => ({ param, msg }))
        );
      return res.status(400).json({ errors }); // 400 mit param-errors
    }
    // params valid überschreib req.params
    req.params = result.data as any;
    next();
  };
}

// middleware: validiert req.query (z.B. ?page=1) gegen schema
export function validateQuery(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const errors = Object.entries(fieldErrors)
        .filter(([, msgs]) => msgs && msgs.length > 0)
        .flatMap(([param, msgs]) =>
          msgs!.map(msg => ({ param, msg }))
        );
      return res.status(400).json({ errors }); // 400 wenn query ungültig
    }
    // query valid, update req.query
    req.query = result.data as any;
    next();
  };
}
