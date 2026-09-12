import { Request, Response } from 'express';
import { ExpenseCategoryService } from '../services/index';
import { HttpStatus } from '@src/config/status';
import { createSuccessBodyResponse } from '@src/utils/createResponseBody';
import logger from '../config/logger';
import { handleError } from '@src/utils/handleError';
import { ExpenseCategory } from '@src/models';
import { parseId } from '@src/utils/parseId';

export class ExpenseCategoryController {
  private service: ExpenseCategoryService;

  constructor() {
    this.service = new ExpenseCategoryService();
  }

  public async findAll(_req: Request, res: Response): Promise<Response> {
    try {
      logger.info(
        '[ExpenseCategory.controller] findAll - fetching all categories',
      );

      const categories = await this.service.findAll();

      logger.info(
        `[ExpenseCategory.controller] findAll - ${categories?.length || '0'} categories retrieved`,
      );

      return res
        .status(HttpStatus.OK)
        .json(
          createSuccessBodyResponse(
            HttpStatus.OK,
            'Expense categories retrieved',
            categories,
          ),
        );
    } catch (error) {
      logger.error(
        '[ExpenseCategory.controller] findAll - error fetching categories',
        error,
      );
      return handleError(error, res);
    }
  }

  public async findById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseId(req.params.id);
      logger.info(
        `[ExpenseCategory.controller] findById - fetching category ${id}`,
      );

      const category = await this.service.findById(id);

      logger.info(
        `[ExpenseCategory.controller] findById - category ${id} retrieved`,
      );

      return res
        .status(HttpStatus.OK)
        .json(
          createSuccessBodyResponse(
            HttpStatus.OK,
            'Expense category retrieved',
            category,
          ),
        );
    } catch (error) {
      logger.error(
        `[ExpenseCategory.controller] findById - error fetching category ${req.params.id}`,
        error,
      );
      return handleError(error, res);
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const body: Omit<ExpenseCategory, 'id'> = req.body;
      logger.info(
        `[ExpenseCategory.controller] create - creating category "${body.name}"`,
      );

      const created = await this.service.create(body.name);

      logger.info(
        `[ExpenseCategory.controller] create - category created with id ${created.id}`,
      );

      return res
        .status(HttpStatus.CREATED)
        .json(
          createSuccessBodyResponse(
            HttpStatus.CREATED,
            'Expense category created',
            created,
          ),
        );
    } catch (error) {
      logger.error(
        '[ExpenseCategory.controller] create - error creating category',
        error,
      );
      return handleError(error, res);
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseId(req.params.id);
      const body: Omit<ExpenseCategory, 'id'> = req.body;
      logger.info(
        `[ExpenseCategory.controller] update - updating category ${id}`,
      );

      const category = await this.service.update(id, body.name);

      logger.info(
        `[ExpenseCategory.controller] update - category ${id} updated`,
      );

      return res
        .status(HttpStatus.OK)
        .json(
          createSuccessBodyResponse(
            HttpStatus.OK,
            'Expense category updated',
            category,
          ),
        );
    } catch (error) {
      logger.error(
        `[ExpenseCategory.controller] update - error updating category ${req.params.id}`,
        error,
      );
      return handleError(error, res);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseId(req.params.id);
      logger.info(
        `[ExpenseCategory.controller] delete - deleting category ${id}`,
      );

      const deleted = await this.service.delete(id);

      logger.info(
        `[ExpenseCategory.controller] delete - category ${id} deleted`,
      );

      return res
        .status(HttpStatus.OK)
        .json(
          createSuccessBodyResponse(
            HttpStatus.OK,
            'Expense category deleted',
            deleted,
          ),
        );
    } catch (error) {
      logger.error(
        `[ExpenseCategory.controller] delete - error deleting category ${req.params.id}`,
        error,
      );
      return handleError(error, res);
    }
  }
}
