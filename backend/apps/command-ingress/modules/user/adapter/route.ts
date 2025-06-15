import express from 'express';
import { UserController } from './controller';
import requireAuthorizedUser from '../../../middlewares/auth';

const setupUserRoute = (controller: UserController) => {
    const router = express.Router();

    router.get('/:id', controller.getOne.bind(controller))
    router.get('/followers/:id/', controller.getFollower.bind(controller))
    router.get('/followings/:id/', controller.getFollowings.bind(controller))

    router.put('/follow/:id', requireAuthorizedUser, controller.followUser.bind(controller))
    router.put('/unfollow/:id', requireAuthorizedUser, controller.unfollowUser.bind(controller))


    return router;
}

export default setupUserRoute;
