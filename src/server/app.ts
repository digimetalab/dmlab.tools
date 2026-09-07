import express from "express";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.js";
import { workspacesRouter } from "./routes/workspaces.js";
import { aiRouter } from "./routes/ai.js";
import { networkRouter } from "./routes/network.js";
import { initDatabase, getDatabaseConfig, isVercelEnvironment } from "../lib/db.js";

dotenv.config();

export const app = express();

app.use(express.json({ limit: "10mb" }));

// Ensure database schema is initialized before handling any requests (critical for serverless cold-starts)
app.use(async (req, res, next) => {
  try {
    await initDatabase();
    next();
  } catch (err) {
    console.error("Database readiness middleware error:", err);
    next(err);
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  const dbConfig = getDatabaseConfig();
  res.json({
    status: "ok",
    app: "DMLab Tools",
    aiConfigured: Boolean(process.env.GROQ_API_KEY),
    aiProvider: "Groq",
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    database: dbConfig.mode,
    isLocalDatabase: dbConfig.isLocal,
    isVercel: isVercelEnvironment(),
    vercelEnv: process.env.VERCEL_ENV || null,
    timestamp: Date.now(),
  });
});

// Mount modular sub-routers
app.use("/api/auth", authRouter);
app.use("/api/workspaces", workspacesRouter);
app.use("/api/ai", aiRouter);
app.use("/api/network", networkRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled API Error:", err);
  res.status(500).json({ error: err?.message || "Internal server error" });
});
