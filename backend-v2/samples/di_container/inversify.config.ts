import { Container } from 'inversify';
import { IUserRepository } from '../api/types';
import { UserRepository } from '../mongoose/repository';
import { DI_TOKENS } from '../api/types';
import { UserService } from '../api/service';

const container = new Container();

container.bind<IUserRepository>(DI_TOKENS.IUserRepository).to(UserRepository);

container.bind<UserService>(UserService).toSelf();

export { container };