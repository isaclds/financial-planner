import { Request, Response } from 'express';
import { IncomeCategoryService } from '../services/index';
import { HttpStatus } from '@src/config/status';
import { createSuccessBodyResponse } from '@src/utils/createResponseBody';
import logger from '../config/logger';
import { handleError } from '@src/utils/handleError';
import { IncomeCategory } from '@src/models';
import { parseId } from '@src/utils/parseId';

export class IncomeCategoryController {
  private service: IncomeCategoryService;

  constructor() {
    this.service = new IncomeCategoryService();
  }

  public async findAll(_req: Request, res: Response): Promise<Response> {
    try {
      logger.info(
        '[IncomeCategory.controller] findAll - fetching all categories',
      );

      const categories = await this.service.findAll();

      logger.info(
        `[IncomeCategory.controller] findAll - ${categories?.length || '0'} categories retrieved`,
      );

      return res
        .status(HttpStatus.OK)
        .json(
          createSuccessBodyResponse(
            HttpStatus.OK,
            'Income categories retrieved',
            categories,
          ),
        );
    } catch (error) {
      logger.error(
        '[IncomeCategory.controller] findAll - error fetching categories',
        error,
      );
      return handleError(error, res);
    }
  }

  public async findById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseId(req.params.id);
      logger.info(
        `[IncomeCategory.controller] findById - fetching category ${id}`,
      );

      const category = await this.service.findById(id);

      logger.info(
        `[IncomeCategory.controller] findById - category ${id} retrieved`,
      );

      return res
        .status(HttpStatus.OK)
        .json(
          createSuccessBodyResponse(
            HttpStatus.OK,
            'Income category retrieved',
            category,
          ),
        );
    } catch (error) {
      logger.error(
        `[IncomeCategory.controller] findById - error fetching category ${req.params.id}`,
        error,
      );
      return handleError(error, res);
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const body: Omit<IncomeCategory, 'id'> = req.body;
      logger.info(
        `[IncomeCategory.controller] create - creating category "${body.name}"`,
      );

      const created = await this.service.create(body.name);

      logger.info(
        `[IncomeCategory.controller] create - category created with id ${created.id}`,
      );

      return res
        .status(HttpStatus.CREATED)
        .json(
          createSuccessBodyResponse(
            HttpStatus.CREATED,
            'Income category created',
            created,
          ),
        );
    } catch (error) {
      logger.error(
        '[IncomeCategory.controller] create - error creating category',
        error,
      );
      return handleError(error, res);
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseId(req.params.id);
      const body: Omit<IncomeCategory, 'id'> = req.body;
      logger.info(
        `[IncomeCategory.controller] update - updating category ${id}`,
      );

      const category = await this.service.update(id, body.name);

      logger.info(
        `[IncomeCategory.controller] update - category ${id} updated`,
      );

      return res
        .status(HttpStatus.OK)
        .json(
          createSuccessBodyResponse(
            HttpStatus.OK,
            'Income category updated',
            category,
          ),
        );
    } catch (error) {
      logger.error(
        `[IncomeCategory.controller] update - error updating category ${req.params.id}`,
        error,
      );
      return handleError(error, res);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseId(req.params.id);
      logger.info(
        `[IncomeCategory.controller] delete - deleting category ${id}`,
      );

      const deleted = await this.service.delete(id);

      logger.info(
        `[IncomeCategory.controller] delete - category ${id} deleted`,
      );

      return res
        .status(HttpStatus.OK)
        .json(
          createSuccessBodyResponse(
            HttpStatus.OK,
            'Income category deleted',
            deleted,
          ),
        );
    } catch (error) {
      logger.error(
        `[IncomeCategory.controller] delete - error deleting category ${req.params.id}`,
        error,
      );
      return handleError(error, res);
    }
  }
}
