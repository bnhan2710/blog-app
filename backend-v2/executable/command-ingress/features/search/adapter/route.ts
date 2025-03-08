import express from 'express';
import { SearchController } from './controller';

const setupSearchRoute = (controller: SearchController) => {
  const router = express.Router();

  router.route('/posts/:query').post(controller.postSeach.bind(controller));
  router.route('/users/:query').post(controller.userSearch.bind(controller));
  return router;
};

export default setupSearchRoute;
