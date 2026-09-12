import { ValidationError } from '@src/errors/ValidationError';
import { IncomeCategory } from '../models/index';
import { IncomeCategoryRepository } from '../repositories/index';
import { EntityNotFound } from '@src/errors/EntityNotFound';
import logger from '../config/logger';

const ENTITY_NAME = 'income category';

export class IncomeCategoryService {
  private repository: IncomeCategoryRepository;

  constructor(repository?: IncomeCategoryRepository) {
    this.repository = repository ?? new IncomeCategoryRepository();
  }

  public async findAll(): Promise<IncomeCategory[] | null> {
    try {
      logger.info('[IncomeCategory.service] findAll - fetching all categories');

      const categories = await this.repository.findAll();

      logger.info(
        `[IncomeCategory.service] findAll - ${categories?.length || '0'} categories retrieved`,
      );

      return categories;
    } catch (error) {
      logger.error(
        '[IncomeCategory.service] findAll - error fetching categories',
        error,
      );
      throw error;
    }
  }

  public async findById(id: number | string): Promise<IncomeCategory | null> {
    try {
      const parsedId = Number(id);
      logger.info(
        `[IncomeCategory.service] findById - fetching category ${parsedId}`,
      );

      if (!this.validateId(parsedId)) {
        throw ValidationError.invalidId(ENTITY_NAME);
      }

      const category = await this.repository.findById(parsedId);

      logger.info(
        `[IncomeCategory.service] findById - category ${parsedId} retrieved`,
      );

      return category;
    } catch (error) {
      logger.error(
        `[IncomeCategory.service] findById - error fetching category ${id}`,
        error,
      );
      throw error;
    }
  }

  public async create(name: string): Promise<IncomeCategory> {
    try {
      const trimmedName = name?.trim();
      logger.info(
        `[IncomeCategory.service] create - creating category "${trimmedName}"`,
      );

      if (!trimmedName) {
        throw ValidationError.requiredField('name', ENTITY_NAME);
      }

      const created = await this.repository.create({ name: trimmedName });

      logger.info(
        `[IncomeCategory.service] create - category created with id ${created.id}`,
      );

      return created;
    } catch (error) {
      logger.error(
        '[IncomeCategory.service] create - error creating category',
        error,
      );
      throw error;
    }
  }

  public async update(
    id: number | string,
    name: string,
  ): Promise<IncomeCategory | null> {
    try {
      const parsedId = Number(id);
      const trimmedName = name?.trim();
      logger.info(
        `[IncomeCategory.service] update - updating category ${parsedId}`,
      );

      if (!this.validateId(parsedId)) {
        throw ValidationError.invalidId(ENTITY_NAME);
      }

      if (!trimmedName) {
        throw ValidationError.requiredField('name', ENTITY_NAME);
      }

      const income = await this.repository.findById(parsedId);

      if (!income) throw new EntityNotFound(ENTITY_NAME);

      const updated = await this.repository.update(income.id, {
        name: trimmedName,
      });

      logger.info(
        `[IncomeCategory.service] update - category ${parsedId} updated`,
      );

      return updated;
    } catch (error) {
      logger.error(
        `[IncomeCategory.service] update - error updating category ${id}`,
        error,
      );
      throw error;
    }
  }

  public async delete(id: number | string): Promise<boolean> {
    try {
      const parsedId = Number(id);
      logger.info(
        `[IncomeCategory.service] delete - deleting category ${parsedId}`,
      );

      if (!this.validateId(parsedId)) {
        throw ValidationError.invalidId(ENTITY_NAME);
      }

      await this.repository.delete(parsedId);

      logger.info(
        `[IncomeCategory.service] delete - category ${parsedId} deleted`,
      );

      return true;
    } catch (error) {
      logger.error(
        `[IncomeCategory.service] delete - error deleting category ${id}`,
        error,
      );
      throw error;
    }
  }

  private validateId(id: number): boolean {
    return !!id && !Number.isNaN(id);
  }
}
