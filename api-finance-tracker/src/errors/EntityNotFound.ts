import { AppError } from './AppError';
import { HttpStatus } from '@src/config/status';

export class EntityNotFound extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}
