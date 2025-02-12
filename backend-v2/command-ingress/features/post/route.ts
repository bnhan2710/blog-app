import express from 'express';
import isAuthenticated from '../../middlewares/auth.ts';

import {
    comment,
    deletePost,
    editPost,
    explorePost,
    getAllComments,
    getAllSavedFromList,
    getHomePost,
    getPost,
    getPostOfTopic,
    getUserPost,
    savePost,
    unSavePost,
    vote,
    writePost,
} from './service.ts';


const setupPostRoute = (
    redisClient: any,
) => {
    const router = express.Router();

    router.route('/home').get(isAuthenticated, getHomePost);
    router.route('/explore').get(explorePost);

    router
        .route('/:postId')
        .get(getPost)
        .put(isAuthenticated, editPost)
        .delete(isAuthenticated, deletePost);

    router.route('/save/:postId').patch(isAuthenticated, savePost);
    router.route('/unsave/:postId').patch(isAuthenticated, unSavePost);
    router.route('/comments/:postId').get(isAuthenticated, getAllComments);
    router.route('/saved/:listName').get(isAuthenticated, getAllSavedFromList);
    router.route('/users/:topic').get(isAuthenticated, getPostOfTopic(redisClient));
    router.route('/vote/:postId').patch(isAuthenticated, vote);
    router.route('/comment/:postId').put(isAuthenticated, comment);
    router.route('/topic/:topic').get(getPostOfTopic(redisClient));
    router.route('/user/:userId').get(getUserPost);
    router.route('/').post(isAuthenticated, writePost);

    return router;
}




export default setupPostRoute;
