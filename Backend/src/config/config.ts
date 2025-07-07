import { cleanEnv, str, num, bool } from 'envalid';

// wir packen hier alle env variablen ein, damit nix vergessen wird und alles gecheckt ist
export const env = cleanEnv(process.env, {
    // datenbank host, z.b. localhost oder remote ip
    DB_HOST:           str(),
    // portnummer
    DB_PORT:           num(),
    // db user name, also user mit rechten auf die db
    DB_USER:           str(),
    // passwort für den db user
    DB_PASS:           str(),
    // name der datenbank
    DB_NAME:           str(),

    // secrets für jwt tokens
    JWT_ACCESS_SECRET: str(), // secret für access token
    JWT_REFRESH_SECRET:str(), // secret für refresh token
    // expires in ms
    ACCESS_TOKEN_EXP:  num(),
    REFRESH_TOKEN_EXP: num(),

    // port auf dem der express server läuft, default 3100
    PORT:              num({ default: 3100 }),
    // front-end origin für cors, z.b. http://localhost:4200
    CLIENT_ORIGIN:     str(),
    // welche env? dev, prod, test - hilft beim logging oder error handling
    NODE_ENV:          str({ choices: ['development','production','test'], default: 'development' }),
});

// cleanEnv: validiert alle envs, schmeißt fehler wenn was fehlt oder falschen typ hat
// so ersparen wir uns null pointer errors später
