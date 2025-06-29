type UserEntity = {
  id: string;
  email: string;
  name: string;
  avatar: string;
  followers?: UserEntity[];
}

interface IUserService {
  getOne(id: string): Promise<UserEntity>;
  followUser(sub : string, id: string) : Promise<boolean>;
  unfollowUser(sub : string, id:string) : Promise<boolean>
  getFollwer(id:string) : Promise<UserEntity[]>
  getFollowing(id:string) : Promise<UserEntity[]>
}

export {
  UserEntity,
  IUserService,
};
