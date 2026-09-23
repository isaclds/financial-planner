import { Request, Response } from 'express';
import { ExpensesService } from '../services/index';
import { HttpStatus } from '@src/config/status';
import { createSuccessBodyResponse } from '@src/utils/createResponseBody';
import logger from '../config/logger';
import { handleError } from '@src/utils/handleError';
import { Expenses } from '@src/models';
import { parseId } from '@src/utils/parseId';

export class ExpensesController {
  private service: ExpensesService;

  constructor() {
    this.service = new ExpensesService();
  }

  public async findAll(_req: Request, res: Response): Promise<Response> {
    try {
      logger.info('[Expenses.controller] findAll - fetching all expenses');

      const expenses = await this.service.findAll();

      logger.info(
        `[Expenses.controller] findAll - ${expenses?.length || '0'} expenses retrieved`,
      );

      return res
        .status(HttpStatus.OK)
        .json(
          createSuccessBodyResponse(
            HttpStatus.OK,
            'Expenses retrieved',
            expenses,
          ),
        );
    } catch (error) {
      logger.error(
        '[Expenses.controller] findAll - error fetching expenses',
        error,
      );
      return handleError(error, res);
    }
  }

  public async findById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseId(req.params.id);
      logger.info(`[Expenses.controller] findById - fetching expense ${id}`);

      const expense = await this.service.findById(id);

      logger.info(`[Expenses.controller] findById - expense ${id} retrieved`);

      return res
        .status(HttpStatus.OK)
        .json(
          createSuccessBodyResponse(
            HttpStatus.OK,
            'Expense retrieved',
            expense,
          ),
        );
    } catch (error) {
      logger.error(
        `[Expenses.controller] findById - error fetching expense ${req.params.id}`,
        error,
      );
      return handleError(error, res);
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const body: Omit<Expenses, 'id'> = req.body;
      logger.info(
        `[Expenses.controller] create - creating expense "${body.name}"`,
      );

      const created = await this.service.create(body);

      logger.info(
        `[Expenses.controller] create - expense created with id ${created.id}`,
      );

      return res
        .status(HttpStatus.CREATED)
        .json(
          createSuccessBodyResponse(
            HttpStatus.CREATED,
            'Expense created',
            created,
          ),
        );
    } catch (error) {
      logger.error(
        '[Expenses.controller] create - error creating expense',
        error,
      );
      return handleError(error, res);
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseId(req.params.id);
      const body: Partial<Omit<Expenses, 'id' | 'created_at'>> = req.body;
      logger.info(`[Expenses.controller] update - updating expense ${id}`);

      const expense = await this.service.update(id, body);

      logger.info(`[Expenses.controller] update - expense ${id} updated`);

      return res
        .status(HttpStatus.OK)
        .json(
          createSuccessBodyResponse(HttpStatus.OK, 'Expense updated', expense),
        );
    } catch (error) {
      logger.error(
        `[Expenses.controller] update - error updating expense ${req.params.id}`,
        error,
      );
      return handleError(error, res);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseId(req.params.id);
      logger.info(`[Expenses.controller] delete - deleting expense ${id}`);

      const deleted = await this.service.delete(id);

      logger.info(`[Expenses.controller] delete - expense ${id} deleted`);

      return res
        .status(HttpStatus.OK)
        .json(
          createSuccessBodyResponse(HttpStatus.OK, 'Expense deleted', deleted),
        );
    } catch (error) {
      logger.error(
        `[Expenses.controller] delete - error deleting expense ${req.params.id}`,
        error,
      );
      return handleError(error, res);
    }
  }

  public async createWithDate(req: Request, res: Response): Promise<Response> {
    try {
      const body: Omit<Expenses, 'id'> = req.body;
      logger.info(
        '[Expenses.controller] createWithDate - creating expense with date',
      );

      const created = await this.service.createWithDate(body);

      logger.info(
        `[Expenses.controller] createWithDate - expense created with id ${created.id}`,
      );

      return res
        .status(HttpStatus.CREATED)
        .json(
          createSuccessBodyResponse(
            HttpStatus.CREATED,
            'Expense created',
            created,
          ),
        );
    } catch (error) {
      logger.error(
        '[Expenses.controller] createWithDate - error creating expense',
        error,
      );
      return handleError(error, res);
    }
  }

  public async findByCategory(req: Request, res: Response): Promise<Response> {
    try {
      const categoryId = parseId(req.params.categoryId);
      logger.info(
        `[Expenses.controller] findByCategory - fetching expenses for category ${categoryId}`,
      );

      const expenses = await this.service.findByCategory(categoryId);

      logger.info(
        `[Expenses.controller] findByCategory - ${expenses?.length || '0'} expenses retrieved`,
      );

      return res
        .status(HttpStatus.OK)
        .json(
          createSuccessBodyResponse(
            HttpStatus.OK,
            'Expenses retrieved',
            expenses,
          ),
        );
    } catch (error) {
      logger.error(
        `[Expenses.controller] findByCategory - error fetching expenses for category ${req.params.categoryId}`,
        error,
      );
      return handleError(error, res);
    }
  }

  public async findByDateRange(req: Request, res: Response): Promise<Response> {
    try {
      const startDate = new Date(req.query.startDate as string);
      const endDate = new Date(req.query.endDate as string);

      logger.info(
        `[Expenses.controller] findByDateRange - fetching expenses from ${startDate.toISOString()} to ${endDate.toISOString()}`,
      );

      const expenses = await this.service.findByDateRange(startDate, endDate);

      logger.info(
        `[Expenses.controller] findByDateRange - ${expenses?.length || '0'} expenses retrieved`,
      );

      return res
        .status(HttpStatus.OK)
        .json(
          createSuccessBodyResponse(
            HttpStatus.OK,
            'Expenses retrieved',
            expenses,
          ),
        );
    } catch (error) {
      logger.error(
        '[Expenses.controller] findByDateRange - error fetching expenses',
        error,
      );
      return handleError(error, res);
    }
  }

  public async getTotal(_req: Request, res: Response): Promise<Response> {
    try {
      logger.info('[Expenses.controller] getTotal - calculating total');

      const total = await this.service.getTotal();

      logger.info(
        `[Expenses.controller] getTotal - total calculated: ${total.total}`,
      );

      return res
        .status(HttpStatus.OK)
        .json(
          createSuccessBodyResponse(
            HttpStatus.OK,
            'Expenses total retrieved',
            total,
          ),
        );
    } catch (error) {
      logger.error(
        '[Expenses.controller] getTotal - error calculating total',
        error,
      );
      return handleError(error, res);
    }
  }

  public async getTotalByCategory(
    _req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      logger.info(
        '[Expenses.controller] getTotalByCategory - calculating totals by category',
      );

      const totals = await this.service.getTotalByCategory();

      logger.info(
        '[Expenses.controller] getTotalByCategory - totals calculated',
      );

      return res
        .status(HttpStatus.OK)
        .json(
          createSuccessBodyResponse(
            HttpStatus.OK,
            'Expenses totals by category retrieved',
            totals,
          ),
        );
    } catch (error) {
      logger.error(
        '[Expenses.controller] getTotalByCategory - error calculating totals',
        error,
      );
      return handleError(error, res);
    }
  }

  public async getMonthlyTotal(req: Request, res: Response): Promise<Response> {
    try {
      const year = Number(req.params.year);
      const month = Number(req.params.month);

      logger.info(
        `[Expenses.controller] getMonthlyTotal - calculating total for ${year}-${month}`,
      );

      const total = await this.service.getMonthlyTotal(year, month);

      logger.info(
        `[Expenses.controller] getMonthlyTotal - total calculated: ${total.total}`,
      );

      return res
        .status(HttpStatus.OK)
        .json(
          createSuccessBodyResponse(
            HttpStatus.OK,
            'Monthly expenses total retrieved',
            total,
          ),
        );
    } catch (error) {
      logger.error(
        `[Expenses.controller] getMonthlyTotal - error calculating total for ${req.params.year}-${req.params.month}`,
        error,
      );
      return handleError(error, res);
    }
  }
}
