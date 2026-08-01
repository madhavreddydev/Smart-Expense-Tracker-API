import { randomUUID } from "node:crypto";
import type { CreateExpenseInput, Expense, TotalsResponse } from "../types.js";

export class ExpenseStore {
  private expenses: Expense[] = [];

  reset(): void {
    this.expenses = [];
  }

  create(input: CreateExpenseInput): Expense {
    const expense: Expense = {
      id: randomUUID(),
      title: input.title,
      amount: input.amount,
      category: input.category,
      date: input.date,
    };
    this.expenses.push(expense);
    return expense;
  }

  findAll(category?: string): Expense[] {
    if (!category) {
      return [...this.expenses];
    }
    const normalized = category.trim().toLowerCase();
    return this.expenses.filter(
      (expense) => expense.category.toLowerCase() === normalized
    );
  }

  findById(id: string): Expense | undefined {
    return this.expenses.find((expense) => expense.id === id);
  }

  delete(id: string): boolean {
    const index = this.expenses.findIndex((expense) => expense.id === id);
    if (index === -1) {
      return false;
    }
    this.expenses.splice(index, 1);
    return true;
  }

  getTotals(): TotalsResponse {
    const byCategory: Record<string, number> = {};
    let overall = 0;

    for (const expense of this.expenses) {
      overall += expense.amount;
      byCategory[expense.category] =
        (byCategory[expense.category] ?? 0) + expense.amount;
    }

    // Avoid floating-point noise in money totals
    overall = roundMoney(overall);
    for (const key of Object.keys(byCategory)) {
      byCategory[key] = roundMoney(byCategory[key]);
    }

    return { overall, byCategory };
  }
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export const expenseStore = new ExpenseStore();
