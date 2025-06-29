import { NotFoundError } from '../../shared/utils/custom-errors';

export const ErrPostNotFound = new NotFoundError('Post not found');
export const ErrUserNotFound = new NotFoundError('User not found');