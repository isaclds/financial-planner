import { BaseRepository } from "./Base.repository";
import { Expenses } from "../models/Expenses.model";

export class ExpensesRepository extends BaseRepository<Expenses> {
  protected tableName: string = "expenses";

  public async create(
    data: Omit<Expenses, "id" | "created_at">,
  ): Promise<Expenses> {
    return this.insert(data);
  }

  public async createWithDate(data: Omit<Expenses, "id">): Promise<Expenses> {
    return this.insert(data);
  }

  public async findByCategory(categoryId: number): Promise<Expenses[]> {
    const result = await this.query(
      `SELECT * FROM ${this.tableName} 
       WHERE category_id = $1 
       ORDER BY created_at DESC`,
      [categoryId],
    );
    return result.rows;
  }

  public async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Expenses[]> {
    const result = await this.query(
      `SELECT * FROM ${this.tableName} 
       WHERE created_at BETWEEN $1 AND $2 
       ORDER BY created_at DESC`,
      [startDate.toISOString(), endDate.toISOString()],
    );
    return result.rows;
  }

  public async update(
    id: number,
    data: Partial<Omit<Expenses, "id" | "created_at">>,
  ): Promise<Expenses | null> {
    return this.update(id, data);
  }

  public async getTotal(): Promise<{ total: number }> {
    const result = await this.query(
      `SELECT COALESCE(SUM(value), 0) as total FROM ${this.tableName}`,
    );
    return { total: Number(result.rows[0]?.total || 0) };
  }

  public async getTotalByCategory(): Promise<
    { category_id: number; total: number }[]
  > {
    const result = await this.query(
      `SELECT category_id, COALESCE(SUM(value), 0) as total 
       FROM ${this.tableName} 
       GROUP BY category_id 
       ORDER BY total DESC`,
    );
    return result.rows;
  }

  public async getMonthlyTotal(
    year: number,
    month: number,
  ): Promise<{ total: number }> {
    const result = await this.query(
      `SELECT COALESCE(SUM(value), 0) as total 
       FROM ${this.tableName} 
       WHERE EXTRACT(YEAR FROM created_at) = $1 
       AND EXTRACT(MONTH FROM created_at) = $2`,
      [year, month],
    );
    return { total: Number(result.rows[0]?.total || 0) };
  }
}
