import { UserEntity, IUserService } from '../types';
import UserModel from '../../../../../internal/model/user';
import { injectable } from 'inversify';
import { ErrUserNotFound, ErrAlreadyFollowed } from '../error';


@injectable()
export class UserServiceImpl implements IUserService {
  unfollowUser(sub: string, id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  getFollwer(id: string): Promise<UserEntity[]> {
    throw new Error('Method not implemented.');
  }
  getFollowing(string: any): Promise<UserEntity[]> {
    throw new Error('Method not implemented.');
  }

  async getOne(id: string): Promise<UserEntity> {
    const user = await UserModel.findById(id);

    return {
      id: String(user._id),
      name: String(user.name),
      avatar: String(user.avatar),
      email: String(user.email),
    };
  }

  async followUser(sub: string, id:string): Promise<boolean> {
    const userFollow = await UserModel.findById(id)
    if(!userFollow) {
    throw ErrUserNotFound
    }

    const isFollowed = userFollow.followers.find((id) => String(id) === sub)
    if(isFollowed){
      throw ErrAlreadyFollowed
    }
    const followResult = await UserModel.updateOne({_id:sub},{ $push:{ followings: id  }})
    const updateFollower = await UserModel.updateOne({_id: id}, { $push : { followers : sub}})

    if(!followResult.modifiedCount || !updateFollower.modifiedCount){
      return false
    }
    return true
  }

}