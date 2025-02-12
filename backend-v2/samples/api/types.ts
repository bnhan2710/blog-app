export type User = {
  id: string;
  email: string;
  name: string;
}

export type UserCreation = {
  email: string;
  name: string;
};

export type UserUpdate = {
  email?: string;
  name?: string;
}

export const ErrDataNotFound = new Error('Data not found')

export interface IUserService {
  create(dto: UserCreation): Promise<User>;
  getAll(): Promise<User[]>;
  getOneById(id: string): Promise<User | null>;
}

