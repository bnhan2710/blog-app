import { User, IUserService, UserCreation } from '../api/types';
import UserModel from './model';
import { ErrDataNotFound } from '../api/types';
export class UserServiceImplMongoose implements IUserService  {

  async create(dto: UserCreation): Promise<User> {
    const { name , email } = dto
    const user = await UserModel.create({
     name,
     email
    })
    return {
      id: String(user._id),
      name: user.name,
      email: user.email
    }
  }

  async getOneById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id)
    if(!user){
      throw ErrDataNotFound
    }
    return {
      id,
      name: user.name,
      email: user.email
    }
  }

  async getAll(): Promise<User[]> {
    const result = await UserModel.find()
    return result.map((u) => ({
      id: String(u._id),
      email: u.email,
      name: u.name,
    }));
  }
}
