import { IUserRepository, User, UserCreationDto, UserUpdateDto } from './types';
import { DomainError } from './error/domain_error';
import { inject, injectable } from 'inversify';
import { DI_TOKENS } from './types';

@injectable()
export class UserService {
  constructor(@inject(DI_TOKENS.IUserRepository) private userRepository: IUserRepository) {}

  getAll(): Promise<User[]> {
    return this.userRepository.getAll();
  }

  async createUser(user: UserCreationDto): Promise<User> {
    if (!user) {
      throw new Error('User could not be null');
    }

    if (user.name.length < 5) {
      throw new DomainError('Name must be longer than 5 characters');
    }

    try {
      return await this.userRepository.create(user);
    } catch (_error) {
      console.log('Error: ', _error);
      throw new DomainError('Error when insert user');
    }
  }

  getOne(userID: string): Promise<User | null> {
    return this.userRepository.getOneById(userID);
  }

  async updateUser(userID: string, user: UserUpdateDto): Promise<string> {
    if (!user) {
      throw new Error('User could not be null');
    }

    if (!user.name || user.name.length < 5) {
      throw new DomainError('Name must be longer than 5 characters');
    }
    try {
      return await this.userRepository.update(userID, user);
    } catch (_error) {
      console.log('Error: ', _error);
      throw new DomainError('Error when update user');
    }
  }

  async deleteUser(userID: string): Promise<string> {
    try {
      return await this.userRepository.delete(userID);
    } catch (_error) {
      console.log('Error: ', _error);
      throw new DomainError('Error when delete user');
    }
  }
}
