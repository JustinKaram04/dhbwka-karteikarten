import rateLimit from 'express-rate-limit'; // express-rate-limit holen fürs throttle

// limiter middleware, damit nicht zu viele anfragen binnen kurzer zeit reinkommen
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // zeitfenster: 15 minuten in ms
  max: 100,// max anfragen pro ip im zeitraum
  standardHeaders: true,// setzt x-rate-limit-header nach spec
  legacyHeaders: false,// keine alten rate-limit-header mehr
});
