import "reflect-metadata";
import express from "express";
import cors from "cors";
import router from "./routes";
import { initDB } from "./db-init";

const app = express();

/**
 * ✅ Allowed frontend origins
 * Add new domains here safely
 */
const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "https://uvv-orcin.vercel.app",
]);

/**
 * ✅ Extra-safe CORS configuration
 */
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server & health checks
    if (!origin) return callback(null, true);

    if (ALLOWED_ORIGINS.has(origin)) {
      return callback(null, true);
    }

    console.warn("❌ Blocked CORS origin:", origin);
    return callback(new Error("CORS not allowed"), false);
  },

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  credentials: true,
  optionsSuccessStatus: 204, // ✅ Mobile Safari compatibility
  maxAge: 86400, // ✅ Cache preflight for 24h
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "1mb" }));

/**
 * 🔥 Fail-fast DB initialization
 * If DB fails → deployment fails (correct behavior)
 */
app.use(async (_req, _res, next) => {
  try {
    await initDB();
    next();
  } catch (err) {
    console.error("❌ Startup DB failure");
    throw err; // Vercel will terminate function
  }
});

app.use("/api", router);

/**
 * ✅ Health check (no DB dependency)
 */
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
