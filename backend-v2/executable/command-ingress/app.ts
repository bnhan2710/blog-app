/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata'
import express from 'express';
import env from './utils/env';
import logger from './middlewares/logger';
import morgan from 'morgan';
import cors from 'cors';
import { recoverMiddleware } from './middlewares/recover';
import { createServer } from 'http';
import { AuthController } from './features/auth/adapter/controller';
import { AuthServiceImpl } from './features/auth/domain/service';
import { GoogleIdentityBroker } from './features/auth/identity-broker/google-idp.broker';
import { postController } from './containers/post.container';
import { userController } from './containers/user.container';
import initAuthRoute from './features/auth/adapter/route';
import initPostRoute from './features/post/adapter/route';
import initUserRoute from './features/user/adapter/route';
const app = express();

const createHttpServer = (redisClient: any) => {
  const server = createServer(app);

  const isProd = !env.DEV;
  if (isProd) {
    app.use(logger);
  }
  app.use(cors());
  app.use(morgan('combined'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Construct services
  const googleIdentityBroker = new GoogleIdentityBroker({
    clientID: env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
    redirectURL: env.GOOGLE_OAUTH_REDIRECT_URL,
  });

  const authService = new AuthServiceImpl(
    googleIdentityBroker,
    env.JWT_SECRET,
    env.JWT_REFRESH_SECRET,
  );

  // Setup route
  app.use('/auth', initAuthRoute(new AuthController(authService)));
  app.use('/post', initPostRoute(postController));
  app.use('/users', initUserRoute(userController));

  app.use(recoverMiddleware);

  // app.use('/search', searchRouter);
  // app.use('/suggestions', setupSuggestionRoute());
  return server;

};

export {
  createHttpServer,
};
