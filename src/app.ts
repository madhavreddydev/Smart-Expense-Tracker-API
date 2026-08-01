import express from "express";
import swaggerUi from "swagger-ui-express";
import { expensesRouter } from "./routes/expenses.js";
import { swaggerSpec } from "./swagger.js";

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Service is healthy
 */
export function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/openapi.json", (_req, res) => {
    res.status(200).json(swaggerSpec);
  });

  app.use("/expenses", expensesRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}
