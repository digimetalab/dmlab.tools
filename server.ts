import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { app } from "./src/server/app.js";
import { initDatabase, getDatabaseConfig } from "./src/lib/db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  // Ensure database schema is initialized
  try {
    await initDatabase();
    const config = getDatabaseConfig();
    console.log(`[DMLab Tools] Database initialized: ${config.mode} (${config.url})`);
  } catch (err) {
    console.error("[DMLab Tools] Database init error:", err);
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DMLab Tools] Server running on http://localhost:${PORT}`);
    console.log(`[DMLab Tools] AI Provider: Groq (${process.env.GROQ_MODEL || "llama-3.3-70b-versatile"})`);
  });
}

startServer();
