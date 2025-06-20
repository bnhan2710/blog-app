import { inject } from 'inversify';
import { BaseController } from '../../../shared/base-controller';
import { HttpRequest } from '../../../shared/types';
import { IUserService } from '../types';
import { Response, NextFunction } from 'express';
import { DI_TOKENS } from '../../../shared/types/di-types';
import { FollowUserDto, GetFollowersDto, UnFollowUserDto } from './dto';
import { validateRequest } from '../../../shared//utils/validate-req';

export class UserController extends BaseController {
  constructor(
   @inject(DI_TOKENS.USER_SERVICE) private service: IUserService
  ) {
    super()
  }

  async getOne(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const { id } = req.params;
      const user = await this.service.getOne(id);
      res.status(200).json(user);
      return;
    });
  }

  async followUser(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const followUserDto  = new FollowUserDto(req.params);
      await validateRequest(followUserDto,res)
      const sub = req.getSubject();
      const followResult = await this.service.followUser(sub,followUserDto.id)
      res.status(200).json(followResult)
    })
  }

  async unfollowUser(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const unFollowUserDto = new UnFollowUserDto(req.params)
      await validateRequest(unFollowUserDto,res)
      const sub = req.getSubject();
      const unfollowResult = await this.service.unfollowUser(sub,unFollowUserDto.id)
      res.status(200).json(unfollowResult)
    })
  }


  async getFollower(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
     const getFollowerDto = new GetFollowersDto(req.params)
     await validateRequest(getFollowerDto,res)
      const followers = await this.service.getFollwer(getFollowerDto.id);
      res.status(200).json({followers});
      return;
    });
  }

  async getFollowings(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const { id } = req.params;
      const followings = await this.service.getFollowing(id);
      res.status(200).json({followings});
      return;
    });
  }
}