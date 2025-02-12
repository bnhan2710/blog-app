import express from 'express';
import {
    addUserIntrests,
    followUser,
    getAllFollowers,
    getAllFollowings,
    getAllList,
    getNotifications,
    getUser,
    getUserIntrests,
    removeUserIntrests,
    suggestUsers,
    unfollowUser,
} from './service';

import isAuthenticated from '../../middlewares/auth';

const router = express.Router();

router.route('/suggest').get(isAuthenticated, suggestUsers);
router.route('/notifications').get(isAuthenticated, getNotifications);

router
    .route('/interests')
    .get(isAuthenticated, getUserIntrests)
    .patch(isAuthenticated, addUserIntrests)
    .delete(isAuthenticated, removeUserIntrests);

router.route('/list').get(isAuthenticated, getAllList);
router.route('/:userId').get(getUser);
router.route('/followers/:userId').get(getAllFollowers);
router.route('/followings/:userId').get(getAllFollowings);
router.route('/follow/:userId').put(isAuthenticated, followUser);
router.route('/unfollow/:userId').put(isAuthenticated, unfollowUser);

export default router;
