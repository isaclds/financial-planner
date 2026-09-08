export interface ExpenseCategory {
  id: number;
  name: string;
}

export class ExpenseCategoryEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
  ) {}
}
