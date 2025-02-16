import 'reflect-metadata';
import { UserService } from './service';
import { IUserRepository, User, UserCreationDto, UserUpdateDto } from './types';
import { DI_TOKENS } from './types';
import { DomainError } from './error/domain_error';
import { ObjectId } from 'mongodb';
import { Container } from 'inversify';
import { de, fa, faker } from '@faker-js/faker/.';

describe('UserService Test', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  beforeEach(() => {

    mockUserRepository =  {
      create: jest.fn(async (dto: UserCreationDto): Promise<User> => {
        return {
          id: String(new ObjectId()),
          name: dto.name,
          email: dto.email,
        };
      }),
      getAll: jest.fn(async (): Promise<User[]> => {
        return [
          {
            id: String(new ObjectId()),
            name: faker.person.fullName(),
            email: faker.internet.email(),
          },
          {
            id: String(new ObjectId()),
            name: faker.person.fullName(),
            email: faker.internet.email(),
          },
        ];

      }),
      getOneById: jest.fn(async (id: string): Promise<User | null> => {
        return {
          id: id,
          name: faker.person.fullName(),
          email: faker.internet.email(),
        };
      }),

      update: jest.fn(async (id: string, dto: UserUpdateDto): Promise<string> => {
        return id;
      }),

      delete: jest.fn(async (id: string): Promise<string> => {
        return id;
      }),

    }

    const container = new Container();
    container.bind<IUserRepository>(DI_TOKENS.IUserRepository).toConstantValue(mockUserRepository);
    userService = new UserService(mockUserRepository);
  });

  describe('createUser', () => {
    it('Should create user when input is valid', async () => {
      const userCreationDto: UserCreationDto = {
        name: 'More than five: ' +  faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      }
      const user = await userService.createUser(userCreationDto);
      // Expect repository is called in right way
      expect(mockUserRepository.create).toHaveBeenCalledWith(userCreationDto);
      expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
      // Expect result
      expect(user).toBeTruthy();
      expect(user.id).toBeTruthy();
      expect(user.email).toEqual(userCreationDto.email);
      expect(user.name).toEqual(userCreationDto.name);
    });
    it('Should return error if the input is violate the business rules', async () => {
      const userCreationDto: UserCreationDto = {
        name: 'KDot',
        email: faker.internet.email(),
        password: faker.internet.password(),
      }
      // Expect error
      await expect(async() => userService.createUser(userCreationDto))
        .rejects
        .toThrowError(new DomainError('Name must be longer than 5 characters'));
      // Expect repository is called in right way
      expect(mockUserRepository.create).toHaveBeenCalledTimes(0);
    });
    it('Should return error if the repository does this', async () => {
      const userCreationDto: UserCreationDto = {
        name: 'Kendrick Lamar',
        email: faker.internet.email(),
        password: faker.internet.password(),
      }
      // Remock the function create in repository
      mockUserRepository.create = jest.fn(async (_: UserCreationDto): Promise<User> => {
        throw new Error('Error when insert record to database');
      });
      await expect(async() => await userService.createUser(userCreationDto))
      .rejects
      .toThrowError(new DomainError('Error when insert user'));
      // Expect repository is called in right way
      expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
    });
  });


  describe('getAll', () => {
    it('Should return all users', async () => {
      const users = await userService.getAll();
      expect(mockUserRepository.getAll).toHaveBeenCalledTimes(1);
      expect(users).toBeTruthy();
      expect(users.length).toBeGreaterThan(0);
      users.forEach((user) => {
        expect(user.id).toBeTruthy();
        expect(user.name).toBeTruthy();
        expect(user.email).toBeTruthy();
      });
    });
  });

  describe('getOne', () => {
    it('Should return user when input is valid', async () => {
      const id = String(new ObjectId());
      const user = await userService.getOne(id);
      expect(mockUserRepository.getOneById).toHaveBeenCalledWith(id);
      expect(mockUserRepository.getOneById).toHaveBeenCalledTimes(1);
      expect(user).toBeTruthy();
      expect(user).not.toBeNull();
      expect(user!.id).toEqual(id);
    });
  });

  describe('updateUser', () => {
    it('Should update user when input is valid', async () => {
      const id = String(new ObjectId());
      const userUpdateDto: UserUpdateDto = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      }
      const result = await userService.updateUser(id, userUpdateDto);
      expect(mockUserRepository.update).toHaveBeenCalledWith(id, userUpdateDto);
      expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(id);
    });
    it('Should return error if the input is violate the business rules', async () => {
      const id = String(new ObjectId());
      const userUpdateDto: UserUpdateDto = {
        name: 'KDot',
      }
      await expect(async() => userService.updateUser(id, userUpdateDto))
        .rejects
        .toThrowError(new DomainError('Name must be longer than 5 characters'));
      // Expect repository is called in right way
      expect(mockUserRepository.update).toHaveBeenCalledTimes(0);
    });
    it('Should return error if the repository does this', async () => {
      const id = String(new ObjectId());
      const userUpdateDto: UserUpdateDto = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      }
      // Remock the function create in repository
      mockUserRepository.update = jest.fn(async (_: string, __: UserUpdateDto): Promise<string> => {
        throw new Error('Error when update record to database');
      });
      await expect(async() => await userService.updateUser(id, userUpdateDto))
      .rejects
      .toThrowError(new DomainError('Error when update user'));
      // Expect repository is called in right way
      expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteUser', () => {
    it('Should delete user when input is valid', async () => {
      const id = String(new ObjectId());
      const result = await userService.deleteUser(id);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(id);
      expect(mockUserRepository.delete).toHaveBeenCalledTimes(1);
      expect(result).toEqual(id);
    });
    it('Should return error if the repository does this', async () => {
      const id = String(new ObjectId());
      // Remock the function create in repository
      mockUserRepository.delete = jest.fn(async (_: string): Promise<string> => {
        throw new Error('Error when delete record to database');
      });
      await expect(async() => await userService.deleteUser(id))
      .rejects
      .toThrowError(new DomainError('Error when delete user'));
      // Expect repository is called in right way
      expect(mockUserRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
