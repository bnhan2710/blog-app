import { NotFoundError } from '../../utils/error.response';

export const ErrNotFoundPost = new NotFoundError('Post not found');
export const ErrNotFoundUser = new NotFoundError('User not found');