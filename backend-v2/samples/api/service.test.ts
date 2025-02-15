import 'reflect-metadata';
import { UserService } from './service';
import { IUserRepository, User, UserCreationDto } from './types';
import { DI_TOKENS } from './types';
import { DomainError } from './error/domain_error';
import { ObjectId } from 'mongodb';
import { Container } from 'inversify';
import { faker } from '@faker-js/faker/.';

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
            name: 'John Doe',
            email: 'hihi@gmail.com',
            createdAt: new Date(),
          },
          {
            id: String(new ObjectId()),
            name: 'Jane Doe',
            email: 'hah@gmail.com',
            createdAt: new Date(),
          },
        ];

      }),
      getOneById: jest.fn(async (id: string): Promise<User | null> => {
        return {
          id: id,
          name: 'Bao Nhan',
          email: 'nhan@gmail.com',
          createdAt: new Date(),
        };
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

});
