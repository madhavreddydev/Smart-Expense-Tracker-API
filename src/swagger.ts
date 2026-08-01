import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Smart Expense Tracker API",
      version: "1.0.0",
      description:
        "REST API for managing personal expenses (Diligent apprenticeship assignment).",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./src/routes/*.ts", "./src/app.ts"],
});
