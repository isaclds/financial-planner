import { AppError } from './AppError';
import { HttpStatus } from '@src/config/status';

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
