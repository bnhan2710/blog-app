import { NotFoundError,BadRequestError } from '../../utils/error.response'


export const ErrUserNotFound = new NotFoundError('User Not Found')
export const ErrAlreadyFollowed = new BadRequestError('Already followed this user')
export const NotYetFollowed = new BadRequestError('Not yet follow this user')