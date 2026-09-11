import { ExpenseCategory } from '../models/index';
import { ExpenseCategoryRepository } from '../repositories/index';

export class ExpenseCategoryService {
  private repository: ExpenseCategoryRepository;

  constructor() {
    this.repository = new ExpenseCategoryRepository();
  }

  public async findAll(): Promise<ExpenseCategory[] | null> {
    return this.repository.findAll();
  }
}
