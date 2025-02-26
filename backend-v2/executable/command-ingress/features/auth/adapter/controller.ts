import { Response, Request, NextFunction } from 'express';
import env from '../../../utils/env';
import { IAuthService } from '../types';
import { ExchangeGoogleTokenBody, LogoutRequestBody, RefreshTokenRequestBody } from './dto';
import { BaseController } from '../../../shared/base-controller';
import { HttpRequest } from '../../../types';
import { validateRequest } from '../../../shared/validate_req';
class AuthController extends BaseController {
  service: IAuthService;

  constructor(service: IAuthService) {
    super();
    this.service = service;
  }

  async exchangeGoogleToken(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const exchangeGoogleTokenBody = new ExchangeGoogleTokenBody(req.query);
      await validateRequest(exchangeGoogleTokenBody,res)
      const exchangeResult = await this.service.exchangeWithGoogleIDP({
        idp: 'google',
        code: exchangeGoogleTokenBody.code,
      });

      const params = new URLSearchParams({
        uid: exchangeResult.sub,
        access_token: exchangeResult.accessToken,
        refresh_token: exchangeResult.refreshToken
      });

      const redirectURL = `${env.CLIENT_URL}/oauth/redirect?${params.toString()}`;
      res.redirect(redirectURL);

      return;
    });
  }

  async logout(req: HttpRequest, res: Response, next: NextFunction): Promise<void> {
    await this.execWithTryCatchBlock(req, res, next, async (req, res, _next) => {
      const logoutRequestBody = new LogoutRequestBody(req.body);
      await validateRequest(logoutRequestBody,res)
      await this.service.logout(logoutRequestBody.refreshToken);
      res.sendStatus(200);
      return;
    });
  }



  async refreshToken(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const refreshTokenRequestBody = new RefreshTokenRequestBody(req.body);
    await validateRequest(refreshTokenRequestBody,res)
    const token = await this.service.refreshToken(refreshTokenRequestBody.refreshToken);
    res.status(200).json({
      refresh_token: token.refreshToken,
      access_token: token.accessToken,
    });

    return;
  }
}

export {
  AuthController,
};
