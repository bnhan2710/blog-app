import { User, UserCreation } from '../types';

class MockUserService {
  private users: User[];
  private nextId: number;

  constructor() {
    this.users = [];
    this.nextId = 1;
  }

  async create(dto: UserCreation): Promise<User> {
    const newUser: User = {
      id: this.nextId.toString(),
      ...dto,
    };
    this.users.push(newUser);
    this.nextId++;
    return newUser;
  }

  async getAll(): Promise<User[]> {
    return this.users;
  }

  async getOneById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }
}

export default MockUserService;