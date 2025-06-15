import { ObjectId } from 'mongodb';

export type UserEntity = {
    id: string;
    name: string;
    avatar: string;
    followers: ObjectId[];
    bio: string;
}

export type PostEntity = {
    id: string;
    title: string;
    markdown: string;
    summary: string;
    createdAt: number;
    image: string;
    tags: string[];
    author: UserEntity;
}

export interface ISearchService {
    postSearch(query: string): Promise<PostEntity[]>
    userSearch(query: string): Promise<UserEntity[]>
}

