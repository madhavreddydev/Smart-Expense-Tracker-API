import { Router } from "express";
import { validateCreateExpense } from "../middleware/validateExpense.js";
import { expenseStore } from "../store/expenseStore.js";

export const expensesRouter = Router();

/**
 * @openapi
 * /expenses:
 *   get:
 *     summary: List expenses
 *     description: Returns all expenses, optionally filtered by category.
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Case-insensitive category filter
 *     responses:
 *       200:
 *         description: List of expenses
 *   post:
 *     summary: Create an expense
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, amount, category, date]
 *             properties:
 *               title:
 *                 type: string
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-08-01"
 *     responses:
 *       201:
 *         description: Expense created
 *       400:
 *         description: Validation error
 */
expensesRouter.get("/", (req, res) => {
  const category =
    typeof req.query.category === "string" ? req.query.category : undefined;
  res.status(200).json(expenseStore.findAll(category));
});

expensesRouter.post("/", validateCreateExpense, (req, res) => {
  const expense = expenseStore.create(req.body);
  res.status(201).json(expense);
});

/**
 * @openapi
 * /expenses/totals:
 *   get:
 *     summary: Calculate expense totals
 *     description: Returns overall total and totals grouped by category.
 *     responses:
 *       200:
 *         description: Totals summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 overall:
 *                   type: number
 *                 byCategory:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 */
expensesRouter.get("/totals", (_req, res) => {
  res.status(200).json(expenseStore.getTotals());
});

/**
 * @openapi
 * /expenses/{id}:
 *   delete:
 *     summary: Delete an expense
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Expense deleted
 *       404:
 *         description: Expense not found
 */
expensesRouter.delete("/:id", (req, res) => {
  const deleted = expenseStore.delete(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Expense not found" });
    return;
  }
  res.status(204).send();
});
