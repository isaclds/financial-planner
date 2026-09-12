import { ValidationError } from '@src/errors/ValidationError';
import { ExpenseCategory } from '../models/index';
import { ExpenseCategoryRepository } from '../repositories/index';
import { EntityNotFound } from '@src/errors/EntityNotFound';

export class ExpenseCategoryService {
  private repository: ExpenseCategoryRepository;
  private entityNotFoundMessage: string;

  constructor() {
    this.repository = new ExpenseCategoryRepository();
    this.entityNotFoundMessage =
      "The expense category passed on the id wasn't found";
  }

  public async findAll(): Promise<ExpenseCategory[] | null> {
    return this.repository.findAll();
  }

  public async findById(id: number | string): Promise<ExpenseCategory | null> {
    const parsedId = Number(id);

    if (!this.validateId(parsedId)) {
      throw new ValidationError(
        'The expense id is required and must be a valid number',
      );
    }

    return this.repository.findById(parsedId);
  }

  public async create(name: string): Promise<ExpenseCategory> {
    const trimmedName = name?.trim();

    if (!trimmedName)
      throw new ValidationError('The expense category name is required');

    return this.repository.create({ name: trimmedName });
  }

  public async update(
    id: number | string,
    name: string,
  ): Promise<ExpenseCategory | null> {
    const parsedId = Number(id);

    if (!this.validateId(parsedId)) {
      throw new ValidationError(
        'The expense id is required and must be a valid number',
      );
    }
    const trimmedName = name?.trim();

    if (!trimmedName)
      throw new ValidationError('The expense category name is required');

    const expense = await this.repository.findById(parsedId);

    if (!expense) throw new EntityNotFound(this.entityNotFoundMessage);

    return this.repository.update(expense.id, { name: trimmedName });
  }

  public async delete(id: number | string): Promise<boolean> {
    const parsedId = Number(id);

    if (!this.validateId(parsedId)) {
      throw new ValidationError(
        'The expense id is required and must be a valid number',
      );
    }

    await this.repository.delete(parsedId);

    return true;
  }

  private validateId(id: number): boolean {
    return !!id && !Number.isNaN(id);
  }
}
