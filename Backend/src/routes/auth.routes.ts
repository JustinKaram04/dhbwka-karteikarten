import { Router } from 'express'; // express-router import
import { registerValidator, loginValidator, register, login } from '../controllers/AuthController'; // validator und handler aus auth-controller

const authRouter = Router(); // neuen router für auth-routen anlegen

// registrieren-route: erst validierung (username/email/password), dann register-funktion
authRouter.post(
  '/register',
  ...registerValidator, // middleware-array aus zod-schema-checks
  register// controller-funktion, erstellt neuen user
);

// login-route: erst validierung (username/password), dann login-funktion
authRouter.post(
  '/login',
  ...loginValidator, // middleware-array prüft body
  login// controller-funktion, loggt user ein und setzt token
);

export default authRouter; // router exportieren damit er in app.ts eingebunden wird
