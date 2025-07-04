import express from 'express';
import requireAuthorizedUser from '../../../shared/middlewares/auth';
import { PostController } from './controller';


const setupPostRoute = (controller: PostController ) => {
  const router = express.Router();

  router.route('/')
    .post(requireAuthorizedUser, controller.createPost.bind(controller));

  router.route('/users/:id')
    .get(controller.fetchPostByUser.bind(controller));

  router.route('/following').get(requireAuthorizedUser, controller.getFollowingPosts.bind(controller))

  router.route('/:id')
    .get(controller.getPost.bind(controller))
    .put(controller.editPost.bind(controller))
    .delete(controller.deletePost.bind(controller))

  return router;

}

export default setupPostRoute;
