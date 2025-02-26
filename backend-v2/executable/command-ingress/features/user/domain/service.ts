import { UserEntity, IUserService } from '../types';
import UserModel from '../../../../../internal/model/user';
import { injectable } from 'inversify';
import { ErrUserNotFound, ErrAlreadyFollowed, NotYetFollowed } from '../error';


@injectable()
export class UserServiceImpl implements IUserService {
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

  async unfollowUser(sub: string, id: string): Promise<boolean> {
    const userUnFollow = await UserModel.findById(id)
    if(!userUnFollow) {
    throw ErrUserNotFound
    }
    const isFollowed = userUnFollow.followers.find((id) => String(id) === sub)
    if(!isFollowed){
      throw NotYetFollowed
    }
    const unfollowResult = await UserModel.updateOne({_id:sub},{ $pull: { followings: id}})
    const updateFollower = await UserModel.updateOne({_id:id},{ $pull: {followers: sub}})
    if(!unfollowResult.modifiedCount || !updateFollower.modifiedCount){
      return false
    }
    return true
  }

  async getFollwer(id: string): Promise<UserEntity[]> {
    const isExist = await UserModel.findById(id).populate({
      path: 'followers',
      select: 'name avatar email'
     })
    if(!isExist){
      throw ErrUserNotFound
    }

    if (!isExist.followers) {
      return []
    }
    const followers = isExist.followers.map((follower: any) => {
      return {
        id: String(follower._id),
        name: String(follower.name),
        avatar: String(follower.avatar),
        email: String(follower.email),
      }
    })

    return followers
  }

 async getFollowing(id: string): Promise<UserEntity[]> {
    const isExist = await UserModel.findById(id).populate({
      path: 'followings',
      select: 'name avatar email'
     })
    if(!isExist){
      throw ErrUserNotFound
    }
    if(!isExist.followings){
      return []
    }
    const followings = isExist.followings.map((following: any) => {
      return {
        id: String(following._id),
        name: String(following.name),
        avatar: String(following.avatar),
        email: String(following.email),
      }
    })
    return followings
  }

}