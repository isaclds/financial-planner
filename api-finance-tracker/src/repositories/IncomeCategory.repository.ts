import { BaseRepository } from './Base.repository';
import { IncomeCategory } from '../models/IncomeCategory.model';

export class IncomeCategoryRepository extends BaseRepository<IncomeCategory> {
  protected tableName: string = 'income_categories';

  public async create(
    data: Omit<IncomeCategory, 'id'>,
  ): Promise<IncomeCategory> {
    return this.insert(data);
  }

  public async findByName(name: string): Promise<IncomeCategory | null> {
    const result = await this.query(
      `SELECT * FROM ${this.tableName} WHERE name = $1`,
      [name],
    );
    return result.rows[0] || null;
  }

  public async update(
    id: number,
    data: Partial<Omit<IncomeCategory, 'id'>>,
  ): Promise<IncomeCategory | null> {
    return this.update(id, data);
  }

  public async getCategoriesWithIncomes(): Promise<
    (IncomeCategory & { total_incomes: number })[]
  > {
    const result = await this.query(
      `SELECT ic.*, COALESCE(SUM(i.value), 0) as total_incomes
       FROM ${this.tableName} ic
       LEFT JOIN incomes i ON i.category_id = ic.id
       GROUP BY ic.id
       ORDER BY ic.name`,
    );
    return result.rows;
  }
}
