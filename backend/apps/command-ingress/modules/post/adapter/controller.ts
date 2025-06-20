import { NextFunction, Response } from 'express';
import { BaseController } from '../../../shared/base-controller';
import { IPostService } from '../types';
import { CreatePostBody, GetPostDto, EditPostBody, DeletePostDto } from './dto';
import { HttpRequest } from '../../../shared/types';
import { validateRequest } from '../../../shared/utils/validate-req';
import { inject } from 'inversify';
import { DI_TOKENS } from '../../../shared/types/di-types';

export class PostController extends BaseController {
  constructor(
    @inject(DI_TOKENS.POST_SERVICE)  private service : IPostService
  ) {
    super()
  }

  async getPost(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const getPostDto = new GetPostDto(req.params);
      await validateRequest(getPostDto,res)
      const post = await this.service.getPost(getPostDto.id);
      res.status(200).json({ post });
      return;
    });
  }

  async createPost(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const body = new CreatePostBody(req.body);
      const sub = req.getSubject();
      await validateRequest(body, res)
      const post = await this.service.createPost({
        authorID: sub,
        title: body.title,
        markdown: body.markdown,
        image: body.image,
        tags: body.tags,
      });

      res.status(201).json(post);

      return;
    });
  }

  async fetchPostByUser(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const id = req.params.id;
      const posts = await this.service.fetchPostsByUser(id);

      res.status(200).json(posts);
    });
  }

  async editPost(req: HttpRequest, res: Response, next: NextFunction): Promise<void>{
    await this.execWithTryCatchBlock(req, res , next, async ( req, res,_next) =>{
      const body = new EditPostBody(req.body)
      await validateRequest(body,res)
      const id = req.params.id;
      const post = await this.service.editPost(id, {
        title: body.title,
        markdown: body.markdown,
        image: body.image,
        tag: body.tags
      })

      res.status(200).json(post)
    })
  }

  async deletePost(req: HttpRequest, res: Response, next: NextFunction) : Promise<void>{
    await this.execWithTryCatchBlock(req, res , next, async ( req, res,_next) =>{
    const deletePosDto = new DeletePostDto(req.params)
    await validateRequest(deletePosDto,res)
    const deleteResult = await this.service.deletePost(deletePosDto.id)
    res.status(200).json(deleteResult)
    })
  }

  async getFollowingPosts(req:HttpRequest, res: Response, next: NextFunction):Promise<void> {
    await this.execWithTryCatchBlock(req, res , next, async ( req, res,_next) =>{
      const sub = req.getSubject()
      const feeds = await this.service.getNewFeeds(sub)
      res.status(200).json(feeds)
      })
  }
}