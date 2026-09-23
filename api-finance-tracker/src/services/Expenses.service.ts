import { ValidationError } from '@src/errors/ValidationError';
import { EntityNotFound } from '@src/errors/EntityNotFound';
import { Expenses } from '../models/Expenses.model';
import { ExpensesRepository } from '../repositories/index';
import logger from '../config/logger';
import { parseId } from '../utils/parseId'; // ajuste o caminho conforme seu projeto

const ENTITY_NAME = 'expenses';

export class ExpensesService {
  private repository: ExpensesRepository;

  constructor(repository?: ExpensesRepository) {
    this.repository = repository ?? new ExpensesRepository();
  }

  /**
   * Valida se o id é um inteiro positivo.
   */
  private validateId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
  }

  public async findAll(): Promise<Expenses[] | null> {
    try {
      logger.info('[Expenses.service] findAll - fetching all expenses');

      const expenses = await this.repository.findAll();

      logger.info(
        `[Expenses.service] findAll - ${expenses?.length || '0'} expenses retrieved`,
      );

      return expenses;
    } catch (error) {
      logger.error(
        '[Expenses.service] findAll - error fetching expenses',
        error,
      );
      throw error;
    }
  }

  public async findById(id: number | string): Promise<Expenses | null> {
    try {
      const parsedId = parseId(String(id), ENTITY_NAME);

      logger.info(`[Expenses.service] findById - fetching expense ${parsedId}`);

      const expense = await this.repository.findById(parsedId);

      logger.info(
        `[Expenses.service] findById - expense ${parsedId} retrieved`,
      );

      return expense;
    } catch (error) {
      logger.error(
        `[Expenses.service] findById - error fetching expense ${id}`,
        error,
      );
      throw error;
    }
  }

  public async create(
    data: Omit<Expenses, 'id' | 'created_at'>,
  ): Promise<Expenses> {
    try {
      logger.info('[Expenses.service] create - creating expense');

      if (data.value === undefined || data.value === null) {
        throw ValidationError.requiredField('value', ENTITY_NAME);
      }

      if (!data.category_id) {
        throw ValidationError.requiredField('category_id', ENTITY_NAME);
      }

      const created = await this.repository.create(data);

      logger.info(
        `[Expenses.service] create - expense created with id ${created.id}`,
      );

      return created;
    } catch (error) {
      logger.error('[Expenses.service] create - error creating expense', error);
      throw error;
    }
  }

  public async createWithDate(data: Omit<Expenses, 'id'>): Promise<Expenses> {
    try {
      logger.info(
        '[Expenses.service] createWithDate - creating expense with date',
      );

      if (data.value === undefined || data.value === null) {
        throw ValidationError.requiredField('value', ENTITY_NAME);
      }

      if (!data.category_id) {
        throw ValidationError.requiredField('category_id', ENTITY_NAME);
      }

      const created = await this.repository.createWithDate(data);

      logger.info(
        `[Expenses.service] createWithDate - expense created with id ${created.id}`,
      );

      return created;
    } catch (error) {
      logger.error(
        '[Expenses.service] createWithDate - error creating expense',
        error,
      );
      throw error;
    }
  }

  public async update(
    id: number | string,
    data: Partial<Omit<Expenses, 'id' | 'created_at'>>,
  ): Promise<Expenses | null> {
    try {
      const parsedId = parseId(String(id), ENTITY_NAME);

      logger.info(`[Expenses.service] update - updating expense ${parsedId}`);

      const expense = await this.repository.findById(parsedId);

      if (!expense) throw new EntityNotFound(ENTITY_NAME);

      const updated = await this.repository.update(parsedId, data);

      logger.info(`[Expenses.service] update - expense ${parsedId} updated`);

      return updated;
    } catch (error) {
      logger.error(
        `[Expenses.service] update - error updating expense ${id}`,
        error,
      );
      throw error;
    }
  }

  public async delete(id: number | string): Promise<boolean> {
    try {
      const parsedId = parseId(String(id), ENTITY_NAME);

      logger.info(`[Expenses.service] delete - deleting expense ${parsedId}`);

      await this.repository.delete(parsedId);

      logger.info(`[Expenses.service] delete - expense ${parsedId} deleted`);

      return true;
    } catch (error) {
      logger.error(
        `[Expenses.service] delete - error deleting expense ${id}`,
        error,
      );
      throw error;
    }
  }

  // -------- Métodos específicos do ExpensesRepository --------

  public async findByCategory(categoryId: number): Promise<Expenses[]> {
    try {
      const parsedId = parseId(String(categoryId), 'category');

      logger.info(
        `[Expenses.service] findByCategory - fetching expenses for category ${parsedId}`,
      );

      return await this.repository.findByCategory(parsedId);
    } catch (error) {
      logger.error(
        `[Expenses.service] findByCategory - error fetching expenses for category ${categoryId}`,
        error,
      );
      throw error;
    }
  }

  public async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Expenses[]> {
    try {
      logger.info(
        `[Expenses.service] findByDateRange - fetching expenses from ${startDate.toISOString()} to ${endDate.toISOString()}`,
      );

      return await this.repository.findByDateRange(startDate, endDate);
    } catch (error) {
      logger.error(
        '[Expenses.service] findByDateRange - error fetching expenses',
        error,
      );
      throw error;
    }
  }

  public async getTotal(): Promise<{ total: number }> {
    try {
      logger.info('[Expenses.service] getTotal - calculating total');

      return await this.repository.getTotal();
    } catch (error) {
      logger.error(
        '[Expenses.service] getTotal - error calculating total',
        error,
      );
      throw error;
    }
  }

  public async getTotalByCategory(): Promise<
    { category_id: number; total: number }[]
  > {
    try {
      logger.info(
        '[Expenses.service] getTotalByCategory - calculating totals by category',
      );

      return await this.repository.getTotalByCategory();
    } catch (error) {
      logger.error(
        '[Expenses.service] getTotalByCategory - error calculating totals',
        error,
      );
      throw error;
    }
  }

  public async getMonthlyTotal(
    year: number,
    month: number,
  ): Promise<{ total: number }> {
    try {
      logger.info(
        `[Expenses.service] getMonthlyTotal - calculating total for ${year}-${month}`,
      );

      if (month < 1 || month > 12) {
        throw ValidationError.requiredField('month', ENTITY_NAME);
      }

      return await this.repository.getMonthlyTotal(year, month);
    } catch (error) {
      logger.error(
        `[Expenses.service] getMonthlyTotal - error calculating total for ${year}-${month}`,
        error,
      );
      throw error;
    }
  }
}
