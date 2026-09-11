import { Request, Response } from 'express';
import { ExpenseCategoryService } from '../services/index';
import { HttpStatus } from '@src/config/status';
import createBodyResponse from '@src/utils/createResponseBody';
import logger from '../config/logger';

export class ExpenseCategoryController {
  private service: ExpenseCategoryService;

  constructor() {
    this.service = new ExpenseCategoryService();
  }

  public async findAll(_req: Request, res: Response): Promise<Response> {
    try {
      const categories = await this.service.findAll();
      return res
        .status(HttpStatus.OK)
        .json(
          createBodyResponse(
            true,
            HttpStatus.OK,
            'All expenses categories retrieved',
            categories,
          ),
        );
    } catch (error) {
      const errorMessage = 'Error fetching expense categories';
      logger.error(errorMessage, error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          createBodyResponse(
            false,
            HttpStatus.INTERNAL_SERVER_ERROR,
            errorMessage,
            error instanceof Error ? error.message : 'Unknown error',
          ),
        );
    }
  }
}
