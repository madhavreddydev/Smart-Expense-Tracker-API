# AI Notes

AI tool used: **Cursor (Composer agent)** for scaffolding, implementation, tests, and docs.

## What was AI-generated vs written/owned by me

| Area | Origin | Notes |
| --- | --- | --- |
| Project layout (`src/`, `tests/`, scripts) | AI-assisted | I chose Node.js + Express + TypeScript to match Diligent’s stack emphasis. |
| In-memory `ExpenseStore` | AI-assisted | Core CRUD/filter/totals logic generated, then reviewed for money rounding and case-insensitive category matching. |
| Validation middleware | AI-assisted | Kept strict checks for positive `amount` and real `YYYY-MM-DD` calendar dates. |
| Express routes + OpenAPI JSDoc | AI-assisted | Bonus feature: OpenAPI/Swagger (only one bonus implemented). |
| Vitest + Supertest suite | AI-assisted | Coverage for create, list, filter, totals, delete, validation, and OpenAPI document. |
| `README.md` / this file | AI-assisted | Commands verified by running them locally. |

I directed the requirements, stack choice, endpoint shapes, and the decision to pick **OpenAPI/Swagger** as the single optional bonus.

## What I validated, tested, or changed — and why

1. **Route ordering** — Confirmed `GET /expenses/totals` is registered before `DELETE /expenses/:id` so `"totals"` is never treated as an id.
2. **Validation** — Rejected empty strings, non-positive amounts, and invalid calendar dates (e.g. `2026-02-31`), not only regex-shaped strings.
3. **Category filter** — Made filtering case-insensitive so `food` and `Food` match the same expenses.
4. **Totals** — Rounded money to 2 decimal places to avoid floating-point artifacts (e.g. `0.1 + 0.2`).
5. **IDs** — Used Node’s `crypto.randomUUID()` instead of adding a `uuid` dependency.
6. **Tests** — Ran `npm test` and fixed issues until all cases passed on a clean install path.
7. **Scripts** — Ensured README commands (`npm install`, `npm start`, `npm test`) match `package.json` exactly for automated evaluation.

## AI suggestions I rejected — and why

1. **Database / Prisma / SQLite** — Assignment explicitly allows in-memory or JSON and says a database is not required. Extra persistence would add setup friction for reviewers.
2. **Auth / JWT** — Not in scope; would obscure the required expense behaviors.
3. **Multiple bonuses** (search + monthly summary + Docker + OpenAPI) — Instructions say pick **at most one**. Kept only OpenAPI/Swagger.
4. **Update/PATCH endpoint** — Not required by the brief; omitted to stay focused.
5. **Heavy framework setup** (NestJS, Spring Boot) — Overkill for a ~4-hour assignment and harder for automated install/start/test.
6. **`uuid` package for ids** — Unnecessary when `crypto.randomUUID()` is built into Node; removed the dependency.

## How to reproduce my verification

```bash
npm install
npm test
npm start
```
