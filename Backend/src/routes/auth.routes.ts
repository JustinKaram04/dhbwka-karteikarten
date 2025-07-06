import { Router } from 'express';
import { registerValidator, loginValidator, register, login } from '../controllers/AuthController';

const authRouter = Router();

authRouter.post('/register', ...registerValidator, register);
authRouter.post('/login',    ...loginValidator,    login);

export default authRouter;