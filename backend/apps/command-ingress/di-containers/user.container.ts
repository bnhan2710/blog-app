import { UserController } from '../modules/user/adapter/controller'
import { UserServiceImpl } from '../modules/user/domain/service'
import { IUserService } from '../modules/user/types'
import { Container } from 'inversify'
import { DI_TOKENS } from '../shared/types/di-types'

const UserContainer = new Container

//Binding
UserContainer.bind<IUserService>(DI_TOKENS.USER_SERVICE).to(UserServiceImpl).inSingletonScope()
UserContainer.bind<UserController>(UserController).toSelf()

//Resolve
const userController = UserContainer.get<UserController>(UserController)

export {
    userController
}

