// src/models/Income.model.ts
export interface Income {
  id: number;
  name: string;
  value: number;
  category_id: number;
  created_at: Date;
}

export class IncomeEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly value: number,
    public readonly category_id: number,
    public readonly created_at: Date,
  ) {}

  public formatValue(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.value);
  }
}
