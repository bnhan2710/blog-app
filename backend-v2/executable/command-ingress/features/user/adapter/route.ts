import express from 'express';
import { UserController } from './controller';
import requireAuthorizedUser from '../../../middlewares/auth';

const setupUserRoute = (controller: UserController) => {
    const router = express.Router();

    router.get('/:id', controller.getOne.bind(controller))
    router.get('/:id/followers', controller.getFollower.bind(controller))
    router.get('/:id/followings', controller.getFollowings.bind(controller))

    router.post('/:id/follow', requireAuthorizedUser, controller.followUser.bind(controller))
    router.delete('/:id/unfollow', requireAuthorizedUser, controller.unfollowUser.bind(controller))


    return router;
}

export default setupUserRoute;
