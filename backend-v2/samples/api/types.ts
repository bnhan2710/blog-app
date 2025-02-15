export type User = {
  id: string;
  email: string;
  name: string;
  createdAt?:Date
}

export type UserCreation = {
  email: string;
  name: string;
  password: string
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
  update(id:string, dto: UserUpdate) : Promise<string>
  delete(id:string) : Promise<string>

}