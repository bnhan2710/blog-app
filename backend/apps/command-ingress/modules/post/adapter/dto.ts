import { Length } from 'class-validator';
import { RequestDto } from '../../auth/adapter/dto';

export class CreatePostBody extends RequestDto {
  @Length(1, 100)
  title: string;
  @Length(1, 10000)
  markdown: string;
  image: string;
  @Length(1, 100)
  tags: string[];

  constructor(body: any) {
    super();
    if (body) {
      this.title = body.title;
      this.markdown = body.markdown;
      this.image = body.image;
      this.tags = body.tags;
    }
  }
}

export class EditPostBody extends RequestDto {
  @Length(1, 100)
  title?: string;
  @Length(1, 10000)
  markdown?: string;
  image?: string;
  @Length(1, 100)
  tags?: string[];

  constructor(body: any){
    super();
    if (body) {
      this.title = body.title;
      this.markdown = body.markdown;
      this.image = body.image;
      this.tags = body.tags;
    }
  }

}

// Data transfer object
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


export class DeletePostDto extends RequestDto{
  @Length(24)
  id: string;

  constructor(requestParams: any) {
    super();
    if (requestParams) {
      this.id = requestParams.id;
    }
  }
}

