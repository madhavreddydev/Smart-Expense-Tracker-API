import type { NextFunction, Request, Response } from "express";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function validateCreateExpense(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { title, amount, category, date } = req.body ?? {};
  const errors: string[] = [];

  if (typeof title !== "string" || title.trim().length === 0) {
    errors.push("title is required and must be a non-empty string");
  }

  if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
    errors.push("amount is required and must be a number greater than 0");
  }

  if (typeof category !== "string" || category.trim().length === 0) {
    errors.push("category is required and must be a non-empty string");
  }

  if (typeof date !== "string" || !ISO_DATE.test(date)) {
    errors.push("date is required and must be in YYYY-MM-DD format");
  } else {
    const parsed = new Date(`${date}T00:00:00.000Z`);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
      errors.push("date must be a valid calendar date in YYYY-MM-DD format");
    }
  }

  if (errors.length > 0) {
    res.status(400).json({ error: "Validation failed", details: errors });
    return;
  }

  req.body = {
    title: title.trim(),
    amount,
    category: category.trim(),
    date,
  };
  next();
}
