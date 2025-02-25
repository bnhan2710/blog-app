import { Response } from 'express';
import responseValidationError from '../shared/response';
import { ValidationError } from 'class-validator';

//T must be a data type contain a validate() method
//and must return object with struct { ok: boolean; errors: ValidationError[] }
export async function validateRequest<T extends { validate: () => Promise<{ ok: boolean; errors: ValidationError[] }>}>
  (dtoInstance: T, res: Response): Promise<void> {
  const validateResult = await dtoInstance.validate();
  if (!validateResult.ok && validateResult.errors.length > 0) {
    responseValidationError(res, validateResult.errors[0]);
  }
}
