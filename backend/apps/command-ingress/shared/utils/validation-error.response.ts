import { ValidationError } from 'class-validator';
import { Response } from 'express';

const responseValidationError = (res: Response, error: ValidationError) => {
  const message = Object.values(error.constraints)
    .map((constraint) => constraint)
    .join(', ');
  res.status(400).json({
    error: 'Validation Error',
    statusCode: 400,
    message: message,
  });

};

export default responseValidationError;