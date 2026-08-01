# Smart Expense Tracker API

REST API for managing personal expenses, built for the Diligent Software Engineering Apprenticeship 2026 take-home assignment.

## What was built

- **Add an expense** — `POST /expenses` with `title`, `amount`, `category`, and `date` (`YYYY-MM-DD`). An `id` is generated server-side.
- **View all expenses** — `GET /expenses`
- **Filter by category** — `GET /expenses?category=Food` (case-insensitive)
- **Totals** — `GET /expenses/totals` returns overall total and totals by category
- **Delete an expense** — `DELETE /expenses/:id`
- **Bonus (OpenAPI/Swagger)** — interactive docs at `/api-docs`, raw spec at `/openapi.json`

Stack: **Node.js + Express + TypeScript**. Expenses are stored **in memory** (resets when the server restarts). No database required.

## Requirements

- Node.js 18+ (tested with Node 24)
- npm

## Install dependencies

```bash
npm install
```

## Start the server

```bash
npm start
```

The API listens on `http://localhost:3000` by default. Override with `PORT=4000 npm start`.

OpenAPI UI: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Run the tests

```bash
npm test
```

## API examples

### Create an expense

```bash
curl -s -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{"title":"Groceries","amount":42.5,"category":"Food","date":"2026-08-01"}'
```

### List / filter

```bash
curl -s http://localhost:3000/expenses
curl -s "http://localhost:3000/expenses?category=Food"
```

### Totals

```bash
curl -s http://localhost:3000/expenses/totals
```

### Delete

```bash
curl -s -X DELETE http://localhost:3000/expenses/<id> -i
```

## Project structure

```text
.
├── README.md
├── AI_NOTES.md
├── package.json
├── src/
│   ├── index.ts
│   ├── app.ts
│   ├── types.ts
│   ├── swagger.ts
│   ├── middleware/
│   ├── routes/
│   └── store/
└── tests/
    └── expenses.test.ts
```
