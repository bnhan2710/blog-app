import { UserController } from '../features/user/adapter/controller'
import { UserServiceImpl } from '../features/user/domain/service'
import { IUserService } from '../features/user/types'
import { Container } from 'inversify'
import { DI_TOKENS } from '../types/di/DiTypes'

const UserContainer = new Container

//Binding
UserContainer.bind<IUserService>(DI_TOKENS.USER_SERVICE).to(UserServiceImpl)
UserContainer.bind<UserController>(UserController).toSelf()

//Resolve
const userController = UserContainer.get<UserController>(UserController)

export {
    userController
}

