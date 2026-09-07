import { Router } from "express";
import crypto from "crypto";
import { getDb } from "../../lib/db.js";
import { requireAuth } from "../../lib/authServer.js";

export const workspacesRouter = Router();

function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

// 1. GET / - List all workspaces user is a member of
workspacesRouter.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const db = getDb();

    const wsResult = await db.execute({
      sql: `SELECT w.id, w.name, w.owner_id, w.plan, w.created_at, wm.role as member_role
            FROM workspaces w
            JOIN workspace_members wm ON w.id = wm.workspace_id
            WHERE wm.user_id = ?
            ORDER BY w.created_at ASC`,
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
          plan: String(w.plan),
          createdAt: String(w.created_at),
          role: String(w.member_role),
          members: membersResult.rows.map((m) => ({
            userId: String(m.user_id),
            email: String(m.email),
            role: String(m.role),
            joinedAt: String(m.joined_at),
          })),
        };
      })
    );

    res.json({ workspaces });
  } catch (error: any) {
    console.error("List workspaces error:", error);
    res.status(500).json({ error: error.message || "Failed to list workspaces." });
  }
});

// 2. POST / - Create a new workspace
workspacesRouter.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const userEmail = req.user!.email;
    const { name } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Workspace name is required." });
    }

    const cleanName = name.trim();
    const workspaceId = generateId("ws");
    const memberId = generateId("mem");
    const now = new Date().toISOString();
    const db = getDb();

    await db.execute({
      sql: "INSERT INTO workspaces (id, name, owner_id, plan, created_at) VALUES (?, ?, ?, ?, ?)",
      args: [workspaceId, cleanName, userId, "pro", now],
    });

    await db.execute({
      sql: "INSERT INTO workspace_members (id, workspace_id, user_id, email, role, joined_at) VALUES (?, ?, ?, ?, ?, ?)",
      args: [memberId, workspaceId, userId, userEmail, "owner", now],
    });

    // Log Activity
    const logId = generateId("log");
    await db.execute({
      sql: "INSERT INTO audit_logs (id, workspace_id, user_id, user_email, action, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [logId, workspaceId, userId, userEmail, "CREATE_WORKSPACE", `Created workspace '${cleanName}'`, now],
    });

    res.status(201).json({
      id: workspaceId,
      name: cleanName,
      ownerId: userId,
      plan: "pro",
      createdAt: now,
      members: [
        {
          userId,
          email: userEmail,
          role: "owner",
          joinedAt: now,
        },
      ],
    });
  } catch (error: any) {
    console.error("Create workspace error:", error);
    res.status(500).json({ error: error.message || "Failed to create workspace." });
  }
});

// 3. POST /:workspaceId/members - Invite/add member to workspace
workspacesRouter.post("/:workspaceId/members", requireAuth, async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user!.userId;
    const userEmail = req.user!.email;
    const { email, role = "member" } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Member email is required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = getDb();

    // Verify requesting user is member with permission
    const currentMember = await db.execute({
      sql: "SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ? LIMIT 1",
      args: [workspaceId, userId],
    });

    if (currentMember.rows.length === 0) {
      return res.status(403).json({ error: "You are not a member of this workspace." });
    }

    // Check if target user already in workspace
    const existingMember = await db.execute({
      sql: "SELECT id FROM workspace_members WHERE workspace_id = ? AND email = ? LIMIT 1",
      args: [workspaceId, cleanEmail],
    });

    if (existingMember.rows.length > 0) {
      return res.status(409).json({ error: "User is already a member of this workspace." });
    }

    // Find if user registered in system
    const userRow = await db.execute({
      sql: "SELECT id FROM users WHERE email = ? LIMIT 1",
      args: [cleanEmail],
    });

    const targetUserId = userRow.rows.length > 0 ? String(userRow.rows[0].id) : generateId("usr_inv");
    const memberId = generateId("mem");
    const now = new Date().toISOString();

    await db.execute({
      sql: "INSERT INTO workspace_members (id, workspace_id, user_id, email, role, joined_at) VALUES (?, ?, ?, ?, ?, ?)",
      args: [memberId, workspaceId, targetUserId, cleanEmail, role, now],
    });

    // Audit log
    const logId = generateId("log");
    await db.execute({
      sql: "INSERT INTO audit_logs (id, workspace_id, user_id, user_email, action, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [logId, workspaceId, userId, userEmail, "INVITE_MEMBER", `Invited ${cleanEmail} as ${role}`, now],
    });

    res.status(201).json({ success: true, email: cleanEmail, role });
  } catch (error: any) {
    console.error("Invite member error:", error);
    res.status(500).json({ error: error.message || "Failed to invite member." });
  }
});

// 4. GET /:workspaceId/snippets - List shared snippets
workspacesRouter.get("/:workspaceId/snippets", requireAuth, async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user!.userId;
    const db = getDb();

    // Verify access
    const memberCheck = await db.execute({
      sql: "SELECT id FROM workspace_members WHERE workspace_id = ? AND user_id = ? LIMIT 1",
      args: [workspaceId, userId],
    });

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ error: "Access denied to workspace snippets." });
    }

    const snippetsResult = await db.execute({
      sql: "SELECT * FROM shared_snippets WHERE workspace_id = ? ORDER BY created_at DESC",
      args: [workspaceId],
    });

    const snippets = snippetsResult.rows.map((row) => {
      let parsedTags: string[] = [];
      try {
        parsedTags = JSON.parse(String(row.tags || "[]"));
      } catch {
        parsedTags = [];
      }

      return {
        id: String(row.id),
        workspaceId: String(row.workspace_id),
        userId: String(row.user_id),
        userEmail: String(row.user_email),
        toolId: String(row.tool_id),
        toolName: String(row.tool_name),
        title: String(row.title),
        content: String(row.content),
        type: String(row.type),
        tags: parsedTags,
        isPublic: Boolean(row.is_public),
        createdAt: String(row.created_at),
      };
    });

    res.json({ snippets });
  } catch (error: any) {
    console.error("List snippets error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch snippets." });
  }
});

// 5. POST /:workspaceId/snippets - Save snippet to workspace vault
workspacesRouter.post("/:workspaceId/snippets", requireAuth, async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user!.userId;
    const userEmail = req.user!.email;
    const { toolId, toolName, title, content, type = "tool", tags = [], isPublic = false } = req.body;

    if (!toolId || !toolName || !title || content === undefined) {
      return res.status(400).json({ error: "toolId, toolName, title, and content are required." });
    }

    const db = getDb();

    // Verify membership
    const memberCheck = await db.execute({
      sql: "SELECT id FROM workspace_members WHERE workspace_id = ? AND user_id = ? LIMIT 1",
      args: [workspaceId, userId],
    });

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ error: "Access denied to workspace." });
    }

    const snippetId = generateId("snp");
    const now = new Date().toISOString();
    const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : []);

    await db.execute({
      sql: `INSERT INTO shared_snippets (
        id, workspace_id, user_id, user_email, tool_id, tool_name, title, content, type, tags, is_public, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        snippetId,
        workspaceId,
        userId,
        userEmail,
        String(toolId),
        String(toolName),
        String(title).trim(),
        String(content),
        String(type),
        tagsJson,
        isPublic ? 1 : 0,
        now,
      ],
    });

    // Log Activity
    const logId = generateId("log");
    await db.execute({
      sql: "INSERT INTO audit_logs (id, workspace_id, user_id, user_email, action, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [logId, workspaceId, userId, userEmail, "SAVE_SNIPPET", `Saved snippet '${title}' for ${toolName}`, now],
    });

    res.status(201).json({
      id: snippetId,
      workspaceId,
      userId,
      userEmail,
      toolId,
      toolName,
      title,
      content,
      type,
      tags: Array.isArray(tags) ? tags : [],
      isPublic: Boolean(isPublic),
      createdAt: now,
    });
  } catch (error: any) {
    console.error("Save snippet error:", error);
    res.status(500).json({ error: error.message || "Failed to save snippet." });
  }
});

// 6. DELETE /:workspaceId/snippets/:snippetId - Delete snippet
workspacesRouter.delete("/:workspaceId/snippets/:snippetId", requireAuth, async (req, res) => {
  try {
    const { workspaceId, snippetId } = req.params;
    const userId = req.user!.userId;
    const userEmail = req.user!.email;
    const db = getDb();

    // Verify membership
    const memberCheck = await db.execute({
      sql: "SELECT role FROM workspace_members WHERE workspace_id = ? AND user_id = ? LIMIT 1",
      args: [workspaceId, userId],
    });

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ error: "Access denied." });
    }

    const snippetCheck = await db.execute({
      sql: "SELECT title FROM shared_snippets WHERE id = ? AND workspace_id = ? LIMIT 1",
      args: [snippetId, workspaceId],
    });

    if (snippetCheck.rows.length === 0) {
      return res.status(404).json({ error: "Snippet not found." });
    }

    const snippetTitle = String(snippetCheck.rows[0].title);

    await db.execute({
      sql: "DELETE FROM shared_snippets WHERE id = ? AND workspace_id = ?",
      args: [snippetId, workspaceId],
    });

    // Log Activity
    const logId = generateId("log");
    const now = new Date().toISOString();
    await db.execute({
      sql: "INSERT INTO audit_logs (id, workspace_id, user_id, user_email, action, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [logId, workspaceId, userId, userEmail, "DELETE_SNIPPET", `Deleted snippet '${snippetTitle}'`, now],
    });

    res.json({ success: true, deletedId: snippetId });
  } catch (error: any) {
    console.error("Delete snippet error:", error);
    res.status(500).json({ error: error.message || "Failed to delete snippet." });
  }
});

// 7. GET /:workspaceId/logs - Get workspace audit activity stream
workspacesRouter.get("/:workspaceId/logs", requireAuth, async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user!.userId;
    const db = getDb();

    const memberCheck = await db.execute({
      sql: "SELECT id FROM workspace_members WHERE workspace_id = ? AND user_id = ? LIMIT 1",
      args: [workspaceId, userId],
    });

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ error: "Access denied to workspace logs." });
    }

    const logsResult = await db.execute({
      sql: "SELECT * FROM audit_logs WHERE workspace_id = ? ORDER BY created_at DESC LIMIT 100",
      args: [workspaceId],
    });

    const logs = logsResult.rows.map((row) => ({
      id: String(row.id),
      workspaceId: String(row.workspace_id),
      userId: String(row.user_id),
      userEmail: String(row.user_email),
      action: String(row.action),
      details: String(row.details),
      createdAt: String(row.created_at),
    }));

    res.json({ logs });
  } catch (error: any) {
    console.error("Get logs error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch audit logs." });
  }
});
