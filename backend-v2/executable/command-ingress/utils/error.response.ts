
import {StatusCodes , ReasonPhrases} from 'http-status-codes'

abstract class CustomError extends Error {
    abstract readonly statusCode: number;
    abstract readonly logging: boolean;
    constructor(message: string) {
      super(message);
    }
  }

export class BadRequestError extends CustomError {
    readonly statusCode = StatusCodes.BAD_REQUEST
    readonly logging = false
    constructor(message: string,) {
        super(message);
       }
}

export class NotFoundError extends CustomError {
    readonly statusCode = StatusCodes.NOT_FOUND;
    readonly logging = false;
    constructor(message: string,) {
        super(message);
    }
}

export class AuthFailError extends CustomError{
    readonly statusCode = StatusCodes.UNAUTHORIZED
    readonly logging = false
    constructor(message: string,) {
        super(message);
    }
}

export class ConflictRequestError extends CustomError{
    readonly statusCode = StatusCodes.CONFLICT
    readonly logging = false
    constructor(message:string){
        super(message);
    }
}

export class ForbiddenError extends CustomError{
    readonly statusCode = StatusCodes.FORBIDDEN
    readonly logging = false
    constructor(message:string){
        super(message);
    }
}