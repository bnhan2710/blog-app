import { PostController } from '../features/post/adapter/controller';
import { IPostService } from '../features/post/types';
import { PostServiceImpl } from '../features/post/domain/service';
import { Container } from 'inversify';
import { DI_TOKENS } from '../types/di/DiTypes';

const PostDIContainer : Container = new Container()

//Binding
PostDIContainer.bind<IPostService>(DI_TOKENS.POST).to(PostServiceImpl)
PostDIContainer.bind<PostController>(PostController).toSelf()

//Resolve
const postController = PostDIContainer.get<PostController>(PostController)

//Export module
export { postController }