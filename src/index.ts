import { createApp } from "./app.js";

const PORT = Number(process.env.PORT) || 3000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Smart Expense Tracker API listening on http://localhost:${PORT}`);
  console.log(`OpenAPI docs: http://localhost:${PORT}/api-docs`);
});
