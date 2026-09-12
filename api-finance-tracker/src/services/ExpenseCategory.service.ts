import { ValidationError } from '@src/errors/ValidationError';
import { ExpenseCategory } from '../models/index';
import { ExpenseCategoryRepository } from '../repositories/index';
import { EntityNotFound } from '@src/errors/EntityNotFound';
import logger from '../config/logger';

const ENTITY_NAME = 'expense category';

export class ExpenseCategoryService {
  private repository: ExpenseCategoryRepository;

  constructor(repository?: ExpenseCategoryRepository) {
    this.repository = repository ?? new ExpenseCategoryRepository();
  }

  public async findAll(): Promise<ExpenseCategory[] | null> {
    try {
      logger.info(
        '[ExpenseCategory.service] findAll - fetching all categories',
      );

      const categories = await this.repository.findAll();

      logger.info(
        `[ExpenseCategory.service] findAll - ${categories?.length || '0'} categories retrieved`,
      );

      return categories;
    } catch (error) {
      logger.error(
        '[ExpenseCategory.service] findAll - error fetching categories',
        error,
      );
      throw error;
    }
  }

  public async findById(id: number | string): Promise<ExpenseCategory | null> {
    try {
      const parsedId = Number(id);
      logger.info(
        `[ExpenseCategory.service] findById - fetching category ${parsedId}`,
      );

      if (!this.validateId(parsedId)) {
        throw ValidationError.invalidId(ENTITY_NAME);
      }

      const category = await this.repository.findById(parsedId);

      logger.info(
        `[ExpenseCategory.service] findById - category ${parsedId} retrieved`,
      );

      return category;
    } catch (error) {
      logger.error(
        `[ExpenseCategory.service] findById - error fetching category ${id}`,
        error,
      );
      throw error;
    }
  }

  public async create(name: string): Promise<ExpenseCategory> {
    try {
      const trimmedName = name?.trim();
      logger.info(
        `[ExpenseCategory.service] create - creating category "${trimmedName}"`,
      );

      if (!trimmedName) {
        throw ValidationError.requiredField('name', ENTITY_NAME);
      }

      const created = await this.repository.create({ name: trimmedName });

      logger.info(
        `[ExpenseCategory.service] create - category created with id ${created.id}`,
      );

      return created;
    } catch (error) {
      logger.error(
        '[ExpenseCategory.service] create - error creating category',
        error,
      );
      throw error;
    }
  }

  public async update(
    id: number | string,
    name: string,
  ): Promise<ExpenseCategory | null> {
    try {
      const parsedId = Number(id);
      const trimmedName = name?.trim();
      logger.info(
        `[ExpenseCategory.service] update - updating category ${parsedId}`,
      );

      if (!this.validateId(parsedId)) {
        throw ValidationError.invalidId(ENTITY_NAME);
      }

      if (!trimmedName) {
        throw ValidationError.requiredField('name', ENTITY_NAME);
      }

      const expense = await this.repository.findById(parsedId);

      if (!expense) throw new EntityNotFound(ENTITY_NAME);

      const updated = await this.repository.update(expense.id, {
        name: trimmedName,
      });

      logger.info(
        `[ExpenseCategory.service] update - category ${parsedId} updated`,
      );

      return updated;
    } catch (error) {
      logger.error(
        `[ExpenseCategory.service] update - error updating category ${id}`,
        error,
      );
      throw error;
    }
  }

  public async delete(id: number | string): Promise<boolean> {
    try {
      const parsedId = Number(id);
      logger.info(
        `[ExpenseCategory.service] delete - deleting category ${parsedId}`,
      );

      if (!this.validateId(parsedId)) {
        throw ValidationError.invalidId(ENTITY_NAME);
      }

      await this.repository.delete(parsedId);

      logger.info(
        `[ExpenseCategory.service] delete - category ${parsedId} deleted`,
      );

      return true;
    } catch (error) {
      logger.error(
        `[ExpenseCategory.service] delete - error deleting category ${id}`,
        error,
      );
      throw error;
    }
  }

  private validateId(id: number): boolean {
    return !!id && !Number.isNaN(id);
  }
}
