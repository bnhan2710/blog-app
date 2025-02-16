import { User, IUserRepository, UserCreationDto, UserUpdateDto } from '../api/types';
import UserModel from './model';
import { ErrDataNotFound } from '../api/types';
import { injectable } from 'inversify'

@injectable()
export class UserRepository implements IUserRepository  {

  async create(dto: UserCreationDto): Promise<User> {
    const { name , email, password } = dto
    const user = await UserModel.create({
     name,
     email,
     password
    })
    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
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

  async update(id: string , dto: UserUpdateDto): Promise<string>{
   const isExist = await UserModel.findById(id)
   if(!isExist){
    throw ErrDataNotFound
   }
   const updated = await UserModel.updateOne({ _id: id }, { $set: dto });
    if(!updated.modifiedCount){
      throw new Error('Update fail')
    }
    return id
  }

  async delete(id:string){
    const isExist = await UserModel.findById(id)
    if(!isExist){
      throw ErrDataNotFound
    }
    const deleted =  await UserModel.deleteOne({_id: id})
    if(!deleted.deletedCount){
      throw new Error('Delete Fail')
    }
    return id
  }
}
