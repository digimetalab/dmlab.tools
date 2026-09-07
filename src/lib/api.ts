import type { UserProfile, Workspace, SharedSnippet, AuditLog, UserRole } from "../types";

const TOKEN_KEY = "dmlab_auth_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(path, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  async signup(email: string, pass: string, displayName: string): Promise<{ token: string; user: UserProfile; workspace: Workspace }> {
    const data = await fetchApi<{ token: string; user: UserProfile; workspace: Workspace }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password: pass, displayName }),
    });
    setStoredToken(data.token);
    return data;
  },

  async login(email: string, pass: string): Promise<{ token: string; user: UserProfile; workspace: Workspace; workspaces: Workspace[] }> {
    const data = await fetchApi<{ token: string; user: UserProfile; workspace: Workspace; workspaces: Workspace[] }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password: pass }),
    });
    setStoredToken(data.token);
    return data;
  },

  async getMe(): Promise<{ user: UserProfile; workspaces: Workspace[]; activeWorkspace: Workspace | null }> {
    return fetchApi<{ user: UserProfile; workspaces: Workspace[]; activeWorkspace: Workspace | null }>("/api/auth/me");
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<boolean> {
    const data = await fetchApi<{ success: boolean }>("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    return data.success;
  },

  logout() {
    clearStoredToken();
  },

  // Workspaces
  async listWorkspaces(): Promise<{ workspaces: Workspace[] }> {
    return fetchApi<{ workspaces: Workspace[] }>("/api/workspaces");
  },

  async createWorkspace(name: string): Promise<Workspace> {
    return fetchApi<Workspace>("/api/workspaces", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  async inviteMember(workspaceId: string, email: string, role: UserRole): Promise<boolean> {
    const data = await fetchApi<{ success: boolean }>(`/api/workspaces/${workspaceId}/members`, {
      method: "POST",
      body: JSON.stringify({ email, role }),
    });
    return data.success;
  },

  // Snippets
  async listSnippets(workspaceId: string): Promise<{ snippets: SharedSnippet[] }> {
    return fetchApi<{ snippets: SharedSnippet[] }>(`/api/workspaces/${workspaceId}/snippets`);
  },

  async saveSnippet(workspaceId: string, snippet: Omit<SharedSnippet, "id" | "workspaceId" | "userId" | "userEmail" | "createdAt">): Promise<SharedSnippet> {
    return fetchApi<SharedSnippet>(`/api/workspaces/${workspaceId}/snippets`, {
      method: "POST",
      body: JSON.stringify(snippet),
    });
  },

  async deleteSnippet(workspaceId: string, snippetId: string): Promise<boolean> {
    const data = await fetchApi<{ success: boolean }>(`/api/workspaces/${workspaceId}/snippets/${snippetId}`, {
      method: "DELETE",
    });
    return data.success;
  },

  // Audit Logs
  async listLogs(workspaceId: string): Promise<{ logs: AuditLog[] }> {
    return fetchApi<{ logs: AuditLog[] }>(`/api/workspaces/${workspaceId}/logs`);
  },
};
