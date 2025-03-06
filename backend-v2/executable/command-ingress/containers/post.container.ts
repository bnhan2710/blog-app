import { Container } from 'inversify';
import { DI_TOKENS } from '../types/di/DiTypes';
import { RedisService } from '../shared/services/redis.service';
import { IPostService } from '../features/post/types';
import { PostServiceImpl } from '../features/post/domain/service';
import { PostController } from '../features/post/adapter/controller';


const PostDIContainer: Container = new Container();


// Binding
PostDIContainer.bind<RedisService>(DI_TOKENS.REDIS_SERVICE).to(RedisService).inSingletonScope();

PostDIContainer.bind<IPostService>(DI_TOKENS.POST_SERVICE).to(PostServiceImpl).inSingletonScope();

PostDIContainer.bind<PostController>(PostController).toSelf();

const postController = PostDIContainer.get<PostController>(PostController);
const postService = PostDIContainer.get<IPostService>(DI_TOKENS.POST_SERVICE);

// Export module
export { postController, postService, PostDIContainer };
