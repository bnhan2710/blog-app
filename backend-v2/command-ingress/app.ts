/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import env from './utils/env';
import logger from './middlewares/logger';

import cors from 'cors';
import { errorHandler } from './middlewares/error_handler';
import { createServer } from 'http';

import authRouter from './features/auth/route';
import setupPostRoute from './features/post/route';
import setupSearchRoute from './features/search/route';
import setupSuggestionRoute from './features/suggestion/route';

const app = express();

const createHttpServer = (redisClient: any) => {
  const server = createServer(app);

  const isProd = !env.DEV;
  if (isProd) {
    app.use(logger);
  }
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));


  // app.use('/post', setupPostRoute(redisClient));
  // app.use('/suggestions', setupSuggestionRoute());
  app.use('/auth', authRouter);
  // app.use('/user', userRouter);
  // app.use('/search', searchRouter);

  app.use(errorHandler);

  return server;
};

export {
  createHttpServer,
};
