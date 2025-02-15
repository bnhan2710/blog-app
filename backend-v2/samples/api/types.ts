export type User = {
  id: string;
  email: string;
  name: string;
  createdAt?:Date
}

export type UserCreationDto = {
  email: string;
  name: string;
  password: string
};

export type UserUpdateDto = {
  email?: string;
  name?: string;
}

export const ErrDataNotFound = new Error('Data not found')

export interface IUserRepository {

  create(dto: UserCreationDto): Promise<User>;
  getAll(): Promise<User[]>;
  getOneById(id: string): Promise<User | null>;
  // update(id:string, dto: UserUpdate) : Promise<string>
  // delete(id:string) : Promise<string>
}

export const DI_TOKENS = {
  IUserRepository: Symbol.for('IUserRepository')
};