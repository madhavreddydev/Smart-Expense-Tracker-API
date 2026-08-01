export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export interface CreateExpenseInput {
  title: string;
  amount: number;
  category: string;
  date: string;
}

export interface TotalsResponse {
  overall: number;
  byCategory: Record<string, number>;
}
