import { Db, ObjectId } from 'mongodb';
import { User, IUserService, UserCreation, UserUpdate, ErrDataNotFound } from '../api/types';

export class UserServiceImpl implements IUserService  {
  // dependencies
  db: Db;
  constructor(db: Db) {
    this.db = db;
  }

  async create(dto: UserCreation): Promise<User> {
    const { name, email } = dto;
    const result = await this.db.collection('users').insertOne({
      email,
      name,
    });

    if(!result.acknowledged) {
      throw new Error('Failed to insert user');
    }

    return {
      id: String(result.insertedId),
      name,
      email,
    };
  }

  async getOneById(id: string): Promise<User | null> {
    const user = await this.db.collection('users').findOne({_id: new ObjectId(id)});

    if (!user) {
     throw ErrDataNotFound
    }

    return {
      id: String(user._id),
      email: user.email,
      name: user.name,
    }
  }

  async getAll(): Promise<User[]> {
    const user = await this.db.collection('users').find().toArray();
    return user.map((u) => ({
      id: String(u._id),
      email: u.email,
      name: u.name,
    }));
  }

  update(id: string, dto: UserUpdate): Promise<string> {
    throw new Error('Method not implemented.');
  }
  delete(id: string) : Promise<string>{
    throw new Error('Method not implemented.');
  }

}