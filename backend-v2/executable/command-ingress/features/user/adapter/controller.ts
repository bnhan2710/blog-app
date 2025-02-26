import { inject } from 'inversify';
import { BaseController } from '../../../shared/base-controller';
import { HttpRequest } from '../../../types';
import { IUserService } from '../types';
import { Response, NextFunction } from 'express';
import { DI_TOKENS } from '../../../types/di/DiTypes';

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
      const { id } = req.params;
      const sub = req.getSubject();
      const followResult = await this.service.followUser(sub,id)
      res.status(200).json(followResult)
    })
  }
}