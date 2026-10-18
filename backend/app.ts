
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import recordRoutes from "./routes/record.routes";
import messageRoutes from "./routes/message.routes";
import { errorHandler } from "./middleware/errorHandler";
import { requireDatabase } from "./middleware/database";
import swaggerUi from "swagger-ui-express";
import { openapiDocument } from "./docs/openapi";

export const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.get("/api/openapi.json", (_req, res) => res.json(openapiDocument));
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));
  app.use(["/api/auth", "/api/records", "/api/messages"], requireDatabase);
  app.use("/api/auth", authRoutes);
  app.use("/api/records", recordRoutes);
  app.use("/api/messages", messageRoutes);

  app.use(errorHandler);
  return app;
};
