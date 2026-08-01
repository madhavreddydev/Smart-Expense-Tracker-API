import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { expenseStore } from "../src/store/expenseStore.js";

const app = createApp();

const sampleExpense = {
  title: "Groceries",
  amount: 42.5,
  category: "Food",
  date: "2026-08-01",
};

beforeEach(() => {
  expenseStore.reset();
});

describe("POST /expenses", () => {
  it("creates an expense with a generated id", async () => {
    const res = await request(app).post("/expenses").send(sampleExpense);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(sampleExpense);
    expect(res.body.id).toEqual(expect.any(String));
  });

  it("rejects invalid payloads", async () => {
    const res = await request(app).post("/expenses").send({
      title: "",
      amount: -5,
      category: "Food",
      date: "not-a-date",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
    expect(res.body.details.length).toBeGreaterThan(0);
  });
});

describe("GET /expenses", () => {
  it("returns all expenses", async () => {
    await request(app).post("/expenses").send(sampleExpense);
    await request(app).post("/expenses").send({
      title: "Uber",
      amount: 18,
      category: "Transport",
      date: "2026-08-02",
    });

    const res = await request(app).get("/expenses");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("filters expenses by category (case-insensitive)", async () => {
    await request(app).post("/expenses").send(sampleExpense);
    await request(app).post("/expenses").send({
      title: "Bus",
      amount: 2.5,
      category: "Transport",
      date: "2026-08-02",
    });

    const res = await request(app).get("/expenses").query({ category: "food" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("Groceries");
  });
});

describe("GET /expenses/totals", () => {
  it("returns overall total and totals by category", async () => {
    await request(app).post("/expenses").send(sampleExpense);
    await request(app).post("/expenses").send({
      title: "Lunch",
      amount: 12.5,
      category: "Food",
      date: "2026-08-03",
    });
    await request(app).post("/expenses").send({
      title: "Metro",
      amount: 5,
      category: "Transport",
      date: "2026-08-03",
    });

    const res = await request(app).get("/expenses/totals");

    expect(res.status).toBe(200);
    expect(res.body.overall).toBe(60);
    expect(res.body.byCategory).toEqual({
      Food: 55,
      Transport: 5,
    });
  });
});

describe("DELETE /expenses/:id", () => {
  it("deletes an existing expense", async () => {
    const created = await request(app).post("/expenses").send(sampleExpense);

    const res = await request(app).delete(`/expenses/${created.body.id}`);

    expect(res.status).toBe(204);

    const list = await request(app).get("/expenses");
    expect(list.body).toHaveLength(0);
  });

  it("returns 404 for unknown ids", async () => {
    const res = await request(app).delete(
      "/expenses/00000000-0000-0000-0000-000000000000"
    );

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Expense not found");
  });
});

describe("OpenAPI docs", () => {
  it("serves the OpenAPI document", async () => {
    const res = await request(app).get("/openapi.json");

    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe("3.0.3");
    expect(res.body.info.title).toBe("Smart Expense Tracker API");
  });
});
