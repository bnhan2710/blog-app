import { UserEntity } from '../user/types';

type PostCreationDto = {
  markdown: string;
  title: string;
  image: string;
  authorID: string;
  tags: string[];
}

type PostUpdateDto = {
  markdown?: string;
  title?: string;
  image?: string;
  tag?: string[];
}


type PostEntity = {
  id: string;
  markdown: string;
  title: string;
  authorID: string;
  image: string;
  tags: string[];
  summary: string;
  createdAt: number;
  author?: UserEntity;
}

interface IPostService {
  createPost(postCreationDto: PostCreationDto): Promise<PostEntity>;
  fetchPostsByUser(id: string): Promise<PostEntity[]>;
  getPost(id: string): Promise<PostEntity>
  editPost(id: string, postUpdateDto: PostUpdateDto) : Promise<PostEntity>
  deletePost(id:string) : Promise<boolean>
  getNewFeeds(sub: string): Promise<PostEntity[]>;
}

export {
  IPostService,
  PostCreationDto,
  PostEntity,
  PostUpdateDto
}