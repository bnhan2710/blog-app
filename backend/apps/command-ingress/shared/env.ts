import { cleanEnv } from 'envalid';
import { bool, port, str } from 'envalid/dist/validators';

const env = cleanEnv(process.env, {
  PORT: port(),
  MONGO_URI: str(),
  JWT_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  NODE_ENV: str({ choices: ['development', 'production'] }),
  CLIENT_URL: str(),
  GOOGLE_OAUTH_CLIENT_ID: str(),
  GOOGLE_OAUTH_CLIENT_SECRET: str(),
  GOOGLE_OAUTH_REDIRECT_URL: str(),
  REDIS_URI: str(),
});

export default env;
