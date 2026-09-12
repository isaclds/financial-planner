import { ValidationError } from '@src/errors/ValidationError';
import { ExpenseCategory } from '../models/index';
import { ExpenseCategoryRepository } from '../repositories/index';
import { EntityNotFound } from '@src/errors/EntityNotFound';

const ENTITY_NAME = 'expense category';

export class ExpenseCategoryService {
  private repository: ExpenseCategoryRepository;

  constructor(repository?: ExpenseCategoryRepository) {
    this.repository = repository ?? new ExpenseCategoryRepository();
  }

  public async findAll(): Promise<ExpenseCategory[] | null> {
    return this.repository.findAll();
  }

  public async findById(id: number | string): Promise<ExpenseCategory | null> {
    const parsedId = Number(id);

    if (!this.validateId(parsedId)) {
      throw ValidationError.invalidId(ENTITY_NAME);
    }

    return this.repository.findById(parsedId);
  }

  public async create(name: string): Promise<ExpenseCategory> {
    const trimmedName = name?.trim();

    if (!trimmedName) {
      throw ValidationError.requiredField('name', ENTITY_NAME);
    }

    return this.repository.create({ name: trimmedName });
  }

  public async update(
    id: number | string,
    name: string,
  ): Promise<ExpenseCategory | null> {
    const parsedId = Number(id);

    if (!this.validateId(parsedId)) {
      throw ValidationError.invalidId(ENTITY_NAME);
    }

    const trimmedName = name?.trim();

    if (!trimmedName) {
      throw ValidationError.requiredField('name', ENTITY_NAME);
    }

    const expense = await this.repository.findById(parsedId);

    if (!expense) throw new EntityNotFound(ENTITY_NAME);

    return this.repository.update(expense.id, { name: trimmedName });
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
