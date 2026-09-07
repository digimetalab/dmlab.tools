import { createClient, type Client } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

export function isVercelEnvironment(): boolean {
  return Boolean(process.env.VERCEL === "1" || process.env.VERCEL || process.env.VERCEL_ENV);
}

export function getDatabaseConfig(): { url: string; authToken?: string; isLocal: boolean; mode: string } {
  const isVercel = isVercelEnvironment();
  const forceRemote = process.env.DATABASE_MODE === "remote" || process.env.FORCE_TURSO === "true";
  
  // Turso Cloud credentials
  const tursoUrl = process.env.TURSO_DATABASE_URL || (process.env.DATABASE_URL?.startsWith("libsql:") ? process.env.DATABASE_URL : undefined);
  const tursoToken = process.env.TURSO_AUTH_TOKEN || undefined;

  // If executing in Vercel (vercel dev, preview, production) or explicitly forced to remote
  if ((isVercel || forceRemote) && (tursoUrl || tursoToken)) {
    const activeUrl = tursoUrl || process.env.DATABASE_URL || "";
    const vercelEnv = process.env.VERCEL_ENV ? ` (${process.env.VERCEL_ENV})` : "";
    return {
      url: activeUrl,
      authToken: tursoToken,
      isLocal: false,
      mode: isVercel ? `Turso Cloud [Vercel${vercelEnv}]` : "Turso Cloud [Remote Mode]",
    };
  }

  // Local SQLite (file:local.db)
  const localUrl = process.env.LOCAL_DATABASE_URL || (process.env.DATABASE_URL?.startsWith("file:") ? process.env.DATABASE_URL : "file:local.db");
  return {
    url: localUrl,
    authToken: undefined,
    isLocal: true,
    mode: "SQLite Local File",
  };
}

let dbClient: Client | null = null;

export function getDb(): Client {
  if (!dbClient) {
    const config = getDatabaseConfig();
    dbClient = createClient({
      url: config.url,
      authToken: config.authToken,
    });
  }
  return dbClient;
}

let isInitialized = false;

/**
 * Initializes the database schema idempotently.
 * Creates all required tables and indexes if they do not exist.
 */
export async function initDatabase(): Promise<Client> {
  const db = getDb();
  if (isInitialized) return db;

  const schemaStatements = [
    // 1. Users Table
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      photo_url TEXT DEFAULT '',
      role TEXT NOT NULL DEFAULT 'owner' CHECK(role IN ('owner', 'admin', 'member', 'viewer')),
      plan TEXT NOT NULL DEFAULT 'free' CHECK(plan IN ('free', 'pro', 'enterprise')),
      active_workspace_id TEXT,
      favorite_tools TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      last_login_at TEXT NOT NULL
    );`,

    // 2. Workspaces Table
    `CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      plan TEXT NOT NULL DEFAULT 'pro' CHECK(plan IN ('free', 'pro', 'enterprise')),
      created_at TEXT NOT NULL,
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    );`,

    // 3. Workspace Members Table
    `CREATE TABLE IF NOT EXISTS workspace_members (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'member' CHECK(role IN ('owner', 'admin', 'member', 'viewer')),
      joined_at TEXT NOT NULL,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(workspace_id, user_id)
    );`,

    // 4. Shared Snippets Table
    `CREATE TABLE IF NOT EXISTS shared_snippets (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      user_email TEXT NOT NULL,
      tool_id TEXT NOT NULL,
      tool_name TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'tool' CHECK(type IN ('tool', 'skill', 'design', 'mcp')),
      tags TEXT NOT NULL DEFAULT '[]',
      is_public INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,

    // 5. Audit Logs Table
    `CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      user_email TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,

    // Indexes
    `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`,
    `CREATE INDEX IF NOT EXISTS idx_members_workspace ON workspace_members(workspace_id);`,
    `CREATE INDEX IF NOT EXISTS idx_members_user ON workspace_members(user_id);`,
    `CREATE INDEX IF NOT EXISTS idx_snippets_workspace ON shared_snippets(workspace_id);`,
    `CREATE INDEX IF NOT EXISTS idx_audit_workspace ON audit_logs(workspace_id);`,
  ];

  for (const stmt of schemaStatements) {
    try {
      await db.execute(stmt);
    } catch (err) {
      console.error("Database schema init error on statement:", stmt, err);
      throw err;
    }
  }

  isInitialized = true;
  return db;
}
