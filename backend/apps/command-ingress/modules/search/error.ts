import { NotFoundError } from '../../shared/utils/custom-errors';

export const ErrNotFoundPost = new NotFoundError('Post not found');
export const ErrNotFoundUser = new NotFoundError('User not found');