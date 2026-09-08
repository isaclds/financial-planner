import { BaseRepository } from "./Base.repository";
import { ExpenseCategory } from "../models/ExpenseCategory.model";

export class ExpenseCategoryRepository extends BaseRepository<ExpenseCategory> {
  protected tableName: string = "expense_categories";

  public async create(
    data: Omit<ExpenseCategory, "id">,
  ): Promise<ExpenseCategory> {
    return this.insert(data);
  }

  public async findByName(name: string): Promise<ExpenseCategory | null> {
    const result = await this.query(
      `SELECT * FROM ${this.tableName} WHERE name = $1`,
      [name],
    );
    return result.rows[0] || null;
  }

  public async update(
    id: number,
    data: Partial<Omit<ExpenseCategory, "id">>,
  ): Promise<ExpenseCategory | null> {
    return this.update(id, data);
  }

  public async getCategoriesWithExpenses(): Promise<
    (ExpenseCategory & { total_expenses: number })[]
  > {
    const result = await this.query(
      `SELECT ec.*, COALESCE(SUM(e.value), 0) as total_expenses
       FROM ${this.tableName} ec
       LEFT JOIN expenses e ON e.category_id = ec.id
       GROUP BY ec.id
       ORDER BY ec.name`,
    );
    return result.rows;
  }
}
