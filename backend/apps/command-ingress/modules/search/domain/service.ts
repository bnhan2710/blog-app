import { ISearchService } from '../types';
import { injectable } from 'inversify';
import { PostEntity,UserEntity } from '../types';
import Post from '../../../../../internal/models/post';
import User from '../../../../../internal/models/user';
import { ErrNotFoundPost, ErrNotFoundUser } from '../error';
@injectable()
export class SearchServiceImpl implements ISearchService {
    async postSearch(query: string): Promise<PostEntity[]> {
        const posts = await Post.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { markdown: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
            ]
        }).populate({
            path: 'author',
            select: ' _id name avatar followers bio'
        }).exec();

        if (!posts) {
            throw ErrNotFoundPost;
        }
        console.log(posts);
        return posts.map((post: any) => {
            return {
                id: String(post._id),
                title: post.title,
                markdown: post.markdown,
                summary: post.summary,
                createdAt: post.createdAt,
                image: post.image,
                tags: post.tags,
                author: {
                    id: String(post.author._id),
                    name: post.author.name,
                    avatar: post.author.avatar,
                    followers: post.author.followers,
                    bio: post.author.bio
                },
                };
            });
        }

      async  userSearch(query: string): Promise<UserEntity[]> {
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
            ]
        }).exec();

        if (!users) {
            throw ErrNotFoundUser;
        }

        return users.map((user: any) => {
            return {
                id: String(user._id),
                name: user.name,
                avatar: user.avatar,
                followers: user.followers,
                bio: user.bio
            };
        });
    }
}
