type ExchangeTokenResult = {
  sub: string;
  refreshToken: string;
  accessToken: string;
}

type ExchangeTokenRequest = {
  code: string;
  idp: string;
}

interface IAuthService {
  exchangeWithGoogleIDP(request: ExchangeTokenRequest): Promise<ExchangeTokenResult>
  logout(token: string): Promise<void>
  refreshToken(token: string): Promise<ExchangeTokenResult>
}


export {
  IAuthService,
  ExchangeTokenRequest,
  ExchangeTokenResult,
}