export interface IncomeCategory {
  id: number;
  name: string;
}

export class IncomeCategoryEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
  ) {}
}
