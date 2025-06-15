import { inject, injectable } from 'inversify';
import Post from '../../../../../internal/models/post';
import User from '../../../../../internal/models/user';
import { PostNotFoundErr } from '../error';
import { PostEntity, PostCreationDto, IPostService, PostUpdateDto } from '../types';
import { RedisService } from '../../../shared/services/redis.service';
import { DI_TOKENS } from '../../../types/di/DiTypes';
import _ from 'lodash';

@injectable()
export class PostServiceImpl implements IPostService {
  private redisService: RedisService;

  constructor(
    @inject(DI_TOKENS.REDIS_SERVICE) redisService: RedisService
  ) {
    this.redisService = redisService;
  }


  async createPost(postCreationDto: PostCreationDto): Promise<PostEntity> {
    const codeRegex = /<code>(.*?)<\/code>/g;
    const withoutCode = postCreationDto.markdown.replace(codeRegex, '');
    const htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
    const summary = withoutCode.replace(htmlRegexG, '');

    const insertResult = await Post.create({
      author: postCreationDto.authorID,
      title: postCreationDto.title,
      markdown: postCreationDto.markdown,
      image: postCreationDto.image,
      tags: postCreationDto.tags,
      summary: summary,
    });

    return {
      id: String(insertResult._id),
      image: String(insertResult.image),
      authorID: String(insertResult.author),
      markdown: insertResult.markdown,
      title: insertResult.title,
      tags: insertResult.tags,
      summary: insertResult.summary,
      createdAt: Number(insertResult.createdAt),
    }
  }

  async getPost(id: string): Promise<PostEntity> {
    const post = await Post.findOne({ _id: id });

    if (!post) {
      throw PostNotFoundErr;
    }

    const user = await User.findOne({ _id: post.author });

    return {
      id: String(post._id),
      image: String(post.image),
      authorID: String(post.author),
      markdown: post.markdown,
      title: post.title,
      tags: post.tags,
      summary: post.summary,
      createdAt: Number(post.createdAt),
      author: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    };
  }

  async fetchPostsByUser(id: string): Promise<PostEntity[]> {
    const results = await Post.find({ author: id })
      .lean(true).sort({ createdAt: -1 });

    return results.map(r => ({
      id: String(r._id),
      title: String(r.title || ''),
      markdown: r.markdown,
      image: r.image,
      authorID: id,
      tags: r.tags,
      summary: String(r.summary || ''),
      createdAt: Number(r.createdAt),
    }));
  }

  async editPost(id: string, postUpdateDto: PostUpdateDto): Promise<PostEntity> {
    const post = await Post.findOne
    ({ _id: id });

    if (!post) {
      throw PostNotFoundErr
    }

    const codeRegex = /<code>(.*?)<\/code>/g;
    const withoutCode = postUpdateDto.markdown.replace(codeRegex, '');
    const htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
    const summary = withoutCode.replace(htmlRegexG, '');

    const updateResult = await Post.updateOne({ _id: id }, {
      title: postUpdateDto.title,
      markdown: postUpdateDto.markdown,
      image: postUpdateDto.image,
      tags: postUpdateDto.tag,
      summary: summary,
    });

    if (updateResult.modifiedCount === 0) {
      throw new Error('Update failed');
    }

    return {
      id: String(post._id),
      image: String(post.image),
      authorID: String(post.author),
      markdown: post.markdown,
      title: post.title,
      tags: post.tags,
      summary: post.summary,
      createdAt: Number(post.createdAt),
    } as PostEntity;
}

  async deletePost(id: string) : Promise<boolean>{
    const post = await Post.findOne({_id: id})
    if(!post){
      throw PostNotFoundErr
    }
    const deleteResult = await Post.deleteOne({_id: id})
    if(deleteResult.deletedCount === 0){
      throw new Error('Delete failed')
    }
    const author = await User.findOne({_id: post.author})
    const followers = _.get(author, 'followers', []).map((follower) => String(follower))
    const score = new Date(post.createdAt).getTime()
    for(const follower of followers){
      await this.redisService.deleteWithScore(`user:${follower}:feed`, score)
    }
    return true
  }

  async getFollowingPosts(sub: string): Promise<PostEntity[]> {
    const posts = await this.redisService.getRange(`user:${sub}:feed`, 0, 10)
    return posts.map((post: string) => JSON.parse(post))
  }

}