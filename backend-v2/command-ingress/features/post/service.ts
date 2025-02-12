import asyncHandler from 'express-async-handler';
import { createClient } from 'redis';

export const getUserPost = asyncHandler(async (_req, _res, _next) => {
});

// todo pagination
export const getHomePost = asyncHandler(async (_req, _res, _next) => {

});

export const getPost = asyncHandler(async (_req, _res, _next) => {

});

export const writePost = asyncHandler(async (_req, _res, _next) => {

});

export const editPost = asyncHandler(async (_req, _res, _next) => {

});

export const deletePost = asyncHandler(async (_req, _res, _next) => {

});

export const suggestTopPosts = asyncHandler(async (_req, _res, _next) => {

});

export const suggestTopics = asyncHandler(async (_req, _res, _next) => {

});

export const getPostOfTopic = (redisClient: ReturnType<typeof createClient>) => {
  return asyncHandler(async (_req, _res, _next) => {})
}

export const vote = asyncHandler(async (_req, _res, _next) => {

});

export const comment = asyncHandler(async (_req, _res, _next) => {

});

export const suggestMore = asyncHandler(async (_req, _res, _next) => {

});

// todo pagination
export const explorePost = asyncHandler(async (_req, _res, _next) => {

});

//todo pagination
export const getAllComments = asyncHandler(async (_req, _res, _next) => {

});

export const savePost = asyncHandler(async (_req, _res, _next) => {

});

export const unSavePost = asyncHandler(async (_req, _res, _next) => {

});

export const getAllSavedFromList = asyncHandler(async (_req, _res, _next) => {

});

