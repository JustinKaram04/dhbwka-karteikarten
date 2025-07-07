import { User } from '../entity/User';// user-entity für db-zugriff
import argon2 from 'argon2';// lib zum hashen & prüfen vom passwort
import jwt from 'jsonwebtoken';// json web tokens für access/refresh
import { env } from '../config/config';// env vars mit secrets + laufzeiten

export class AuthService {
  //registriert neuen user
  static async register(username: string, email: string, password: string) {
    // check ob username oder email schon vergeben ist
    if (await User.findOne({ where: [{ username }, { email }] })) {
      //conflict wenn schon da
      throw { status: 409, message: 'Username or email taken' };
    }
    //hash passwort mit argon2
    const passwordHash = await argon2.hash(password);
    // user-entity bauen
    const user = User.create({ username, email, passwordHash });
    await user.save(); // speichere in der db
    return user;// gib den neuen user zurück
  }

  // loggt user ein und erstellt tokens
  static async login(username: string, password: string) {
    // find user per username oder email
    const user = await User.findOne({
      where: [{ username }, { email: username }]
    });
    // wenn nicht gefunden oder pw ungültig
    if (!user || !await argon2.verify(user.passwordHash, password)) {
      // unauorized
      throw { status: 401, message: 'Invalid credentials' };
    }

    // erstelle access token, payload ist sub = user.id
    const accessToken = jwt.sign(
      { sub: user.id.toString() },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.ACCESS_TOKEN_EXP } // expire in sekunden
    );

    // erstelle refresh token für langfristige auth
    const refreshToken = jwt.sign(
      { sub: user.id.toString() },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.REFRESH_TOKEN_EXP }
    );

    return { accessToken, refreshToken }; //gib beides zurück
  }
}
