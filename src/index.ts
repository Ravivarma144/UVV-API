import "reflect-metadata";
import express from "express";
import cors from "cors";
import router from "./routes";
import { initDB } from "./db-init";

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 CRITICAL: fail fast before handling requests
app.use(async (_req, _res, next) => {
  await initDB(); // ❌ throws → app crashes
  next();
});

app.use("/api", router);

export default app;
