import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { User } from '../entity/User';
import { env } from '../config/config';

export class AuthService {
  static async register(username: string, email: string, password: string) {
  const existing = await User.findOne({ where: [{ username }, { email }] });
    if (existing) throw new Error('Username or Email taken');
    const hash = await argon2.hash(password);
    const user = User.create({ username, email, passwordHash: hash });
    await user.save();
    return user;
  }

  static async login(username: string, password: string) {
    const user = await User.findOne({ where: [{ username }, { email: username }] });
    if (!user || !(await argon2.verify(user.passwordHash, password))) {
      throw new Error('Invalid credentials');
    }

const access = jwt.sign(
  { sub: user.id.toString() },
  env.JWT_ACCESS_SECRET,
  {
    expiresIn: env.ACCESS_TOKEN_EXP
  } as jwt.SignOptions
);


const refresh = jwt.sign(
  { sub: user.id.toString() },
  env.JWT_REFRESH_SECRET,
  {
    expiresIn: env.REFRESH_TOKEN_EXP
  } as jwt.SignOptions
);



}}