import { Container } from 'inversify';
import { DI_TOKENS } from '../shared/types/di-types';
import { RedisCacheService } from '../shared/services/redis.service';
import { IPostService } from '../modules/post/types';
import { PostServiceImpl } from '../modules/post/domain/service';
import { PostController } from '../modules/post/adapter/controller';
import { ICacheService } from '../shared/interfaces';


const PostDIContainer: Container = new Container();


// Binding
PostDIContainer.bind<ICacheService>(DI_TOKENS.CACHE_SERVICE).to(RedisCacheService).inSingletonScope();

PostDIContainer.bind<IPostService>(DI_TOKENS.POST_SERVICE).to(PostServiceImpl).inSingletonScope();

PostDIContainer.bind<PostController>(PostController).toSelf();

const postController = PostDIContainer.get<PostController>(PostController);
const postService = PostDIContainer.get<IPostService>(DI_TOKENS.POST_SERVICE);

// Export module
export { postController, postService, PostDIContainer };
