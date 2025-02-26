import { Length } from 'class-validator';
import { RequestDto } from '../../auth/adapter/dto';
export class GetPostDto extends RequestDto {
  @Length(24)
  id: string;

  constructor(requestParams: any) {
    super();
    if (requestParams) {
      this.id = requestParams.id;
    }
  }
}


export class FollowUserDto extends RequestDto{
  @Length(24)
  id: string;

  constructor(requestParams: any) {
    super();
    if (requestParams) {
      this.id = requestParams.id;
    }
  }
}

export class UnFollowUserDto extends RequestDto{
    @Length(24)
    id: string;
    constructor(requestParams: any) {
      super();
      if (requestParams) {
        this.id = requestParams.id;
      }
    }
  }


export class GetFollowersDto extends RequestDto{
  @Length(24)
  id: string;
  constructor(requestParams: any) {
    super();
    if (requestParams) {
      this.id = requestParams.id;
    }
  }
}

export class GetFollowingsDto extends RequestDto{
  @Length(24)
  id: string;
  constructor(requestParams: any) {
    super();
    if (requestParams) {
      this.id = requestParams.id;
    }
  }
}