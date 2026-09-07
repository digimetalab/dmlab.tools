import { Router } from "express";
import crypto from "crypto";
import { getDb } from "../../lib/db.js";
import { hashPassword, comparePassword, signToken, requireAuth } from "../../lib/authServer.js";

export const authRouter = Router();

function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

// 1. POST /signup - Register a new user
authRouter.post("/signup", async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Valid email and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (displayName && typeof displayName === "string") 
      ? displayName.trim() 
      : cleanEmail.split("@")[0];

    const db = getDb();

    // Check if user already exists
    const existing = await db.execute({
      sql: "SELECT id FROM users WHERE email = ? LIMIT 1",
      args: [cleanEmail],
    });

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const userId = generateId("usr");
    const workspaceId = generateId("ws");
    const memberId = generateId("mem");
    const now = new Date().toISOString();
    const hashedPassword = await hashPassword(password);
    const defaultFavorites = JSON.stringify(["json-formatter", "ai-text-enhancer", "whois-lookup"]);

    // Insert User
    await db.execute({
      sql: `INSERT INTO users (
        id, email, display_name, password_hash, photo_url, role, plan, active_workspace_id, favorite_tools, created_at, last_login_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        userId,
        cleanEmail,
        cleanName,
        hashedPassword,
        "",
        "owner",
        "pro",
        workspaceId,
        defaultFavorites,
        now,
        now,
      ],
    });

    // Create Initial Default Workspace
    const workspaceName = `${cleanName}'s Workspace`;
    await db.execute({
      sql: `INSERT INTO workspaces (id, name, owner_id, plan, created_at) VALUES (?, ?, ?, ?, ?)`,
      args: [workspaceId, workspaceName, userId, "pro", now],
    });

    // Add User as Owner in Workspace Members
    await db.execute({
      sql: `INSERT INTO workspace_members (id, workspace_id, user_id, email, role, joined_at) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [memberId, workspaceId, userId, cleanEmail, "owner", now],
    });

    const token = signToken({
      userId,
      email: cleanEmail,
      role: "owner",
    });

    const userProfile = {
      userId,
      email: cleanEmail,
      displayName: cleanName,
      photoURL: "",
      role: "owner" as const,
      plan: "pro" as const,
      activeWorkspaceId: workspaceId,
      favoriteTools: ["json-formatter", "ai-text-enhancer", "whois-lookup"],
      createdAt: now,
      lastLoginAt: now,
    };

    const initialWorkspace = {
      id: workspaceId,
      name: workspaceName,
      ownerId: userId,
      plan: "pro" as const,
      createdAt: now,
      members: [
        {
          userId,
          email: cleanEmail,
          role: "owner" as const,
          joinedAt: now,
        },
      ],
    };

    res.status(201).json({
      token,
      user: userProfile,
      workspace: initialWorkspace,
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(500).json({ error: error.message || "Failed to register account." });
  }
});

// 2. POST /login - Authenticate existing user
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = getDb();

    const userResult = await db.execute({
      sql: "SELECT * FROM users WHERE email = ? LIMIT 1",
      args: [cleanEmail],
    });

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const row = userResult.rows[0];
    const passwordMatch = await comparePassword(password, String(row.password_hash));
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const now = new Date().toISOString();
    await db.execute({
      sql: "UPDATE users SET last_login_at = ? WHERE id = ?",
      args: [now, String(row.id)],
    });

    const token = signToken({
      userId: String(row.id),
      email: cleanEmail,
      role: String(row.role),
    });

    // Fetch workspaces for user
    const wsResult = await db.execute({
      sql: `SELECT w.id, w.name, w.owner_id, w.plan, w.created_at, wm.role as member_role
            FROM workspaces w
            JOIN workspace_members wm ON w.id = wm.workspace_id
            WHERE wm.user_id = ?`,
      args: [String(row.id)],
    });

    const workspaces = wsResult.rows.map((w) => ({
      id: String(w.id),
      name: String(w.name),
      ownerId: String(w.owner_id),
      plan: String(w.plan) as any,
      createdAt: String(w.created_at),
      role: String(w.member_role),
      members: [],
    }));

    const activeWs = workspaces.find((w) => w.id === String(row.active_workspace_id)) || workspaces[0] || null;

    let parsedFavorites: string[] = [];
    try {
      parsedFavorites = JSON.parse(String(row.favorite_tools || "[]"));
    } catch {
      parsedFavorites = [];
    }

    const userProfile = {
      userId: String(row.id),
      email: cleanEmail,
      displayName: String(row.display_name),
      photoURL: String(row.photo_url || ""),
      role: String(row.role) as any,
      plan: String(row.plan) as any,
      activeWorkspaceId: activeWs?.id || "",
      favoriteTools: parsedFavorites,
      createdAt: String(row.created_at),
      lastLoginAt: now,
    };

    res.json({
      token,
      user: userProfile,
      workspace: activeWs,
      workspaces,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message || "Failed to log in." });
  }
});

// 3. POST /google - Authenticate or register with Google OAuth credential
authRouter.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential || typeof credential !== "string") {
      return res.status(400).json({ error: "Google credential token is required." });
    }

    // Verify token with Google's OAuth2 tokeninfo endpoint
    const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`;
    const googleRes = await fetch(googleVerifyUrl);

    if (!googleRes.ok) {
      const errData = await googleRes.json().catch(() => ({}));
      return res.status(401).json({
        error: "Invalid or expired Google authentication token.",
        details: errData,
      });
    }

    const googleUser = (await googleRes.json()) as {
      email?: string;
      email_verified?: string | boolean;
      name?: string;
      picture?: string;
      sub?: string;
      aud?: string;
    };

    if (!googleUser.email) {
      return res.status(400).json({ error: "Google account does not provide an email address." });
    }

    // Verify Client ID if configured in environment
    const configuredClientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
    if (configuredClientId && googleUser.aud && googleUser.aud !== configuredClientId) {
      return res.status(401).json({ error: "Google token audience mismatch. Unauthorized client ID." });
    }

    const cleanEmail = googleUser.email.trim().toLowerCase();
    const cleanName = googleUser.name?.trim() || cleanEmail.split("@")[0];
    const photoURL = googleUser.picture || "";
    const now = new Date().toISOString();
    const db = getDb();

    // Check if user already exists
    const existing = await db.execute({
      sql: "SELECT * FROM users WHERE email = ? LIMIT 1",
      args: [cleanEmail],
    });

    let userId: string;
    let userRole = "owner";
    let userPlan = "pro";
    let activeWorkspaceId = "";
    let favoriteTools: string[] = ["json-formatter", "ai-text-enhancer", "whois-lookup"];

    if (existing.rows.length > 0) {
      // Existing user: Update last_login_at and photo_url if missing
      const row = existing.rows[0];
      userId = String(row.id);
      userRole = String(row.role || "owner");
      userPlan = String(row.plan || "pro");
      activeWorkspaceId = String(row.active_workspace_id || "");

      try {
        favoriteTools = JSON.parse(String(row.favorite_tools || "[]"));
      } catch {
        favoriteTools = ["json-formatter", "ai-text-enhancer", "whois-lookup"];
      }

      await db.execute({
        sql: `UPDATE users SET last_login_at = ?, photo_url = CASE WHEN (photo_url IS NULL OR photo_url = '') THEN ? ELSE photo_url END WHERE id = ?`,
        args: [now, photoURL, userId],
      });
    } else {
      // New user: Create user, default workspace, and member entry
      userId = generateId("usr");
      const workspaceId = generateId("ws");
      const memberId = generateId("mem");
      const randomSecret = crypto.randomBytes(32).toString("hex");
      const hashedPassword = await hashPassword(randomSecret);
      const defaultFavorites = JSON.stringify(favoriteTools);

      await db.execute({
        sql: `INSERT INTO users (
          id, email, display_name, password_hash, photo_url, role, plan, active_workspace_id, favorite_tools, created_at, last_login_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          userId,
          cleanEmail,
          cleanName,
          hashedPassword,
          photoURL,
          "owner",
          "pro",
          workspaceId,
          defaultFavorites,
          now,
          now,
        ],
      });

      const workspaceName = `${cleanName}'s Workspace`;
      await db.execute({
        sql: `INSERT INTO workspaces (id, name, owner_id, plan, created_at) VALUES (?, ?, ?, ?, ?)`,
        args: [workspaceId, workspaceName, userId, "pro", now],
      });

      await db.execute({
        sql: `INSERT INTO workspace_members (id, workspace_id, user_id, email, role, joined_at) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [memberId, workspaceId, userId, cleanEmail, "owner", now],
      });

      activeWorkspaceId = workspaceId;
    }

    // Fetch user's workspaces
    const wsResult = await db.execute({
      sql: `SELECT w.id, w.name, w.owner_id, w.plan, w.created_at, wm.role as member_role
            FROM workspaces w
            JOIN workspace_members wm ON w.id = wm.workspace_id
            WHERE wm.user_id = ?`,
      args: [userId],
    });

    const workspaces = wsResult.rows.map((w) => ({
      id: String(w.id),
      name: String(w.name),
      ownerId: String(w.owner_id),
      plan: String(w.plan) as any,
      createdAt: String(w.created_at),
      role: String(w.member_role),
      members: [],
    }));

    const activeWs = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0] || null;

    const token = signToken({
      userId,
      email: cleanEmail,
      role: userRole,
    });

    const userProfile = {
      userId,
      email: cleanEmail,
      displayName: cleanName,
      photoURL,
      role: userRole as any,
      plan: userPlan as any,
      activeWorkspaceId: activeWs?.id || "",
      favoriteTools,
      createdAt: now,
      lastLoginAt: now,
    };

    res.json({
      token,
      user: userProfile,
      workspace: activeWs,
      workspaces,
    });
  } catch (error: any) {
    console.error("Google Auth error:", error);
    res.status(500).json({ error: error.message || "Failed to authenticate with Google." });
  }
});

// 4. GET /me - Get authenticated user profile & workspaces
authRouter.get("/me", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const db = getDb();

    const userResult = await db.execute({
      sql: "SELECT * FROM users WHERE id = ? LIMIT 1",
      args: [userId],
    });

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const row = userResult.rows[0];

    // Fetch workspaces
    const wsResult = await db.execute({
      sql: `SELECT w.id, w.name, w.owner_id, w.plan, w.created_at, wm.role as member_role
            FROM workspaces w
            JOIN workspace_members wm ON w.id = wm.workspace_id
            WHERE wm.user_id = ?`,
      args: [userId],
    });

    const workspaces = await Promise.all(
      wsResult.rows.map(async (w) => {
        const membersResult = await db.execute({
          sql: "SELECT user_id, email, role, joined_at FROM workspace_members WHERE workspace_id = ?",
          args: [String(w.id)],
        });

        return {
          id: String(w.id),
          name: String(w.name),
          ownerId: String(w.owner_id),
          plan: String(w.plan) as any,
          createdAt: String(w.created_at),
          members: membersResult.rows.map((m) => ({
            userId: String(m.user_id),
            email: String(m.email),
            role: String(m.role) as any,
            joinedAt: String(m.joined_at),
          })),
        };
      })
    );

    const activeWs = workspaces.find((w) => w.id === String(row.active_workspace_id)) || workspaces[0] || null;

    let parsedFavorites: string[] = [];
    try {
      parsedFavorites = JSON.parse(String(row.favorite_tools || "[]"));
    } catch {
      parsedFavorites = [];
    }

    const userProfile = {
      userId: String(row.id),
      email: String(row.email),
      displayName: String(row.display_name),
      photoURL: String(row.photo_url || ""),
      role: String(row.role) as any,
      plan: String(row.plan) as any,
      activeWorkspaceId: activeWs?.id || "",
      favoriteTools: parsedFavorites,
      createdAt: String(row.created_at),
      lastLoginAt: String(row.last_login_at),
    };

    res.json({
      user: userProfile,
      workspaces,
      activeWorkspace: activeWs,
    });
  } catch (error: any) {
    console.error("Get /me error:", error);
    res.status(500).json({ error: error.message || "Failed to retrieve user profile." });
  }
});

// 4. PUT /profile - Update profile details
authRouter.put("/profile", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { displayName, photoURL, favoriteTools, activeWorkspaceId } = req.body;
    const db = getDb();

    const updates: string[] = [];
    const args: any[] = [];

    if (displayName !== undefined && typeof displayName === "string") {
      updates.push("display_name = ?");
      args.push(displayName.trim());
    }
    if (photoURL !== undefined && typeof photoURL === "string") {
      updates.push("photo_url = ?");
      args.push(photoURL.trim());
    }
    if (favoriteTools !== undefined && Array.isArray(favoriteTools)) {
      updates.push("favorite_tools = ?");
      args.push(JSON.stringify(favoriteTools));
    }
    if (activeWorkspaceId !== undefined && typeof activeWorkspaceId === "string") {
      updates.push("active_workspace_id = ?");
      args.push(activeWorkspaceId.trim());
    }

    if (updates.length > 0) {
      args.push(userId);
      await db.execute({
        sql: `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
        args,
      });
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: error.message || "Failed to update profile." });
  }
});
