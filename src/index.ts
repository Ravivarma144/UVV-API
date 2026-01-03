import "reflect-metadata"; // MUST be first
import express from "express";
import cors from "cors";
import router from "./routes";
import { AppDataSource } from "./data-source";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);

// 🔥 Lazy DB initialization (VERY IMPORTANT)
let isInitialized = false;

app.use(async (_req, _res, next) => {
  if (!isInitialized) {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("✅ Database connected");
    }
    isInitialized = true;
  }
  next();
});

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app; // ✅ REQUIRED FOR VERCEL
