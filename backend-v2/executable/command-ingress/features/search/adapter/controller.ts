import { NextFunction, Response } from 'express';
import { BaseController } from '../../../shared/base-controller';
import { HttpRequest } from '../../../types';
import { validateRequest } from '../../../shared/validate_req';
import { inject } from 'inversify';
import { DI_TOKENS } from '../../../types/di/DiTypes';
import { ISearchService } from '../types';
import { SearchPostDto,SearchUserDto } from './dto';

export class SearchController extends BaseController {
    constructor(
        @inject(DI_TOKENS.SEARCH_SERVICE) private service: ISearchService
    ) {
        super()
    }

    async postSeach(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
        await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
            const { query } = req.params;
            const searchPostDto = new SearchPostDto({ query });
            await validateRequest(searchPostDto, res);
            const posts = await this.service.postSearch(searchPostDto.query);
            res.status(200).json( posts );
            return;
        });
    }

    async userSearch(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
        await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
            const { query } = req.params;
            const searchUserDto = new SearchUserDto({ query });
            await validateRequest(searchUserDto, res);
            const users = await this.service.userSearch(searchUserDto.query);
            res.status(200).json(users);
            return;
        });
    }
}