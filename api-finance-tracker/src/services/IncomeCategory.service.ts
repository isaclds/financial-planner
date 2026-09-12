import { ValidationError } from '@src/errors/ValidationError';
import { IncomeCategory } from '../models/index';
import { IncomeCategoryRepository } from '../repositories/index';
import { EntityNotFound } from '@src/errors/EntityNotFound';

const ENTITY_NAME = 'income category';

export class IncomeCategoryService {
  private repository: IncomeCategoryRepository;

  constructor(repository?: IncomeCategoryRepository) {
    this.repository = repository ?? new IncomeCategoryRepository();
  }

  public async findAll(): Promise<IncomeCategory[] | null> {
    return this.repository.findAll();
  }

  public async findById(id: number | string): Promise<IncomeCategory | null> {
    const parsedId = Number(id);

    if (!this.validateId(parsedId)) {
      throw ValidationError.invalidId(ENTITY_NAME);
    }

    return this.repository.findById(parsedId);
  }

  public async create(name: string): Promise<IncomeCategory> {
    const trimmedName = name?.trim();

    if (!trimmedName) {
      throw ValidationError.requiredField('name', ENTITY_NAME);
    }

    return this.repository.create({ name: trimmedName });
  }

  public async update(
    id: number | string,
    name: string,
  ): Promise<IncomeCategory | null> {
    const parsedId = Number(id);

    if (!this.validateId(parsedId)) {
      throw ValidationError.invalidId(ENTITY_NAME);
    }

    const trimmedName = name?.trim();

    if (!trimmedName) {
      throw ValidationError.requiredField('name', ENTITY_NAME);
    }

    const income = await this.repository.findById(parsedId);

    if (!income) throw new EntityNotFound(ENTITY_NAME);

    return this.repository.update(income.id, { name: trimmedName });
  }

  public async delete(id: number | string): Promise<boolean> {
    const parsedId = Number(id);

    if (!this.validateId(parsedId)) {
      throw ValidationError.invalidId(ENTITY_NAME);
    }

    await this.repository.delete(parsedId);

    return true;
  }

  private validateId(id: number): boolean {
    return !!id && !Number.isNaN(id);
  }
}
