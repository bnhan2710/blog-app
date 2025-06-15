import { Length } from 'class-validator';
import { RequestDto } from '../../auth/adapter/dto';

export class SearchPostDto extends RequestDto {
  @Length(1)
  query: string;

  constructor(requestParams: any) {
    super();
    if (requestParams) {
      this.query = requestParams.query;
    }
  }
}

export class SearchUserDto extends RequestDto {
  @Length(1)
  query: string;

  constructor(requestParams: any) {
    super();
    if (requestParams) {
      this.query = requestParams.query;
    }
  }
}