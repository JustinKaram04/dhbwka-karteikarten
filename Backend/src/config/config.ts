import { cleanEnv, str, num } from 'envalid';

export const env = cleanEnv(process.env, {
    DB_HOST:           str(),
    DB_PORT:           num(),
    DB_USER:           str(),
    DB_PASS:           str(),
    DB_NAME:           str(),
    JWT_ACCESS_SECRET: str(),
    JWT_REFRESH_SECRET:str(),
    ACCESS_TOKEN_EXP:  str(),
    REFRESH_TOKEN_EXP: str(),
    PORT:              num({ default: 3100 }),
    CLIENT_ORIGIN:     str(),
});

