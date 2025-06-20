import 'reflect-metadata'
import express from 'express';
import env from './shared/env';
import logger from './shared/middlewares/logger';
import morgan from 'morgan';
import cors from 'cors';
import { ErrorHandler } from './shared/utils';
import { createServer } from 'http';
import { AuthController } from './modules/auth/adapter/controller';
import { AuthServiceImpl } from './modules/auth/domain/service';
import { GoogleIdentityBroker } from './modules/auth/identity-broker/google-idp.broker';
import { postController } from './di-containers/post.container';
import { userController } from './di-containers/user.container';
import { searchController } from './di-containers/search.container';
import initAuthRoute from './modules/auth/adapter/route';
import initPostRoute from './modules/post/adapter/route';
import initUserRoute from './modules/user/adapter/route';
import initSearchRoute from './modules/search/adapter/route';
const app = express();

export const createHttpServer = (redisClient: any) => {
  const server = createServer(app);

  const isProd = !env.NODE_ENV || env.NODE_ENV === 'production';
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
  app.use('/search', initSearchRoute(searchController));
  // app.use('/search', searchRouter());
  // app.use('/suggestions', setupSuggestionRoute());

  // Error handler
  app.use(ErrorHandler.handle());
  return server;

};