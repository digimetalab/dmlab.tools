import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredToken } from '../lib/api';
import type { User, UserProfile, Workspace, SharedSnippet, AuditLog, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  activeWorkspace: Workspace | null;
  workspaces: Workspace[];
  sharedSnippets: SharedSnippet[];
  auditLogs: AuditLog[];
  loginWithGoogle: (credential: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  logout: () => Promise<void>;
  createWorkspace: (name: string) => Promise<string | null>;
  switchWorkspace: (workspaceId: string) => void;
  inviteMember: (email: string, role: UserRole) => Promise<boolean>;
  saveSnippet: (snippet: Omit<SharedSnippet, 'id' | 'workspaceId' | 'userId' | 'userEmail' | 'createdAt'>) => Promise<void>;
  deleteSnippet: (snippetId: string) => Promise<void>;
  logActivity: (action: string, details: string) => Promise<void>;
  toggleFavoriteTool: (toolId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [sharedSnippets, setSharedSnippets] = useState<SharedSnippet[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const loadWorkspaceData = async (wsId: string) => {
    try {
      const [snippetsRes, logsRes] = await Promise.all([
        api.listSnippets(wsId),
        api.listLogs(wsId),
      ]);
      setSharedSnippets(snippetsRes.snippets || []);
      setAuditLogs(logsRes.logs || []);
    } catch (err) {
      console.error("Failed to load workspace data:", err);
    }
  };

  // 1. Check existing session on boot
  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }

    api.getMe()
      .then((data) => {
        const u: User = {
          uid: data.user.userId,
          email: data.user.email,
          displayName: data.user.displayName,
          photoURL: data.user.photoURL,
        };
        setUser(u);
        setProfile(data.user);
        setWorkspaces(data.workspaces || []);
        setActiveWorkspace(data.activeWorkspace);

        if (data.activeWorkspace) {
          loadWorkspaceData(data.activeWorkspace.id);
        }
      })
      .catch((err) => {
        console.warn("Session check failed, clearing token:", err.message);
        api.logout();
        setUser(null);
        setProfile(null);
        setActiveWorkspace(null);
        setWorkspaces([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 2. Sign In With Email
  const signInWithEmail = async (email: string, pass: string) => {
    const data = await api.login(email, pass);
    const u: User = {
      uid: data.user.userId,
      email: data.user.email,
      displayName: data.user.displayName,
      photoURL: data.user.photoURL,
    };
    setUser(u);
    setProfile(data.user);
    setActiveWorkspace(data.workspace);
    setWorkspaces(data.workspaces || [data.workspace]);

    if (data.workspace) {
      loadWorkspaceData(data.workspace.id);
    }
  };

  // 3. Sign Up With Email
  const signUpWithEmail = async (email: string, pass: string, displayName: string) => {
    const data = await api.signup(email, pass, displayName);
    const u: User = {
      uid: data.user.userId,
      email: data.user.email,
      displayName: data.user.displayName,
      photoURL: data.user.photoURL,
    };
    setUser(u);
    setProfile(data.user);
    setActiveWorkspace(data.workspace);
    setWorkspaces([data.workspace]);

    if (data.workspace) {
      loadWorkspaceData(data.workspace.id);
    }
  };

  // 4. Google Login with credential
  const loginWithGoogle = async (credential: string) => {
    const data = await api.loginWithGoogle(credential);
    const u: User = {
      uid: data.user.userId,
      email: data.user.email,
      displayName: data.user.displayName,
      photoURL: data.user.photoURL,
    };
    setUser(u);
    setProfile(data.user);
    setActiveWorkspace(data.workspace);
    setWorkspaces(data.workspaces || [data.workspace]);

    if (data.workspace) {
      loadWorkspaceData(data.workspace.id);
    }
  };

  // 5. Logout
  const logout = async () => {
    api.logout();
    setUser(null);
    setProfile(null);
    setActiveWorkspace(null);
    setWorkspaces([]);
    setSharedSnippets([]);
    setAuditLogs([]);
  };

  // 6. Update User Profile
  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!profile) return false;
    const success = await api.updateProfile(updates);
    if (success) {
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
      if (updates.displayName || updates.photoURL) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                displayName: updates.displayName ?? prev.displayName,
                photoURL: updates.photoURL ?? prev.photoURL,
              }
            : null
        );
      }
    }
    return success;
  };

  // 7. Create Workspace
  const createWorkspace = async (name: string): Promise<string | null> => {
    try {
      const newWs = await api.createWorkspace(name);
      setWorkspaces((prev) => [...prev, newWs]);
      setActiveWorkspace(newWs);
      await updateUserProfile({ activeWorkspaceId: newWs.id });
      loadWorkspaceData(newWs.id);
      return newWs.id;
    } catch (err) {
      console.error("Create workspace failed:", err);
      return null;
    }
  };

  // 8. Switch Workspace
  const switchWorkspace = (workspaceId: string) => {
    const target = workspaces.find((w) => w.id === workspaceId);
    if (target) {
      setActiveWorkspace(target);
      updateUserProfile({ activeWorkspaceId: target.id });
      loadWorkspaceData(target.id);
    }
  };

  // 9. Invite Member
  const inviteMember = async (email: string, role: UserRole): Promise<boolean> => {
    if (!activeWorkspace) return false;
    try {
      const success = await api.inviteMember(activeWorkspace.id, email, role);
      if (success) {
        // Refresh workspaces list
        const res = await api.listWorkspaces();
        setWorkspaces(res.workspaces);
        const updated = res.workspaces.find((w) => w.id === activeWorkspace.id);
        if (updated) setActiveWorkspace(updated);
        // Refresh logs
        const logsRes = await api.listLogs(activeWorkspace.id);
        setAuditLogs(logsRes.logs);
      }
      return success;
    } catch (err) {
      console.error("Invite member error:", err);
      return false;
    }
  };

  // 10. Save Snippet
  const saveSnippet = async (
    snippet: Omit<SharedSnippet, 'id' | 'workspaceId' | 'userId' | 'userEmail' | 'createdAt'>
  ) => {
    if (!activeWorkspace) return;
    try {
      const created = await api.saveSnippet(activeWorkspace.id, snippet);
      setSharedSnippets((prev) => [created, ...prev]);
      // Refresh logs
      const logsRes = await api.listLogs(activeWorkspace.id);
      setAuditLogs(logsRes.logs);
    } catch (err) {
      console.error("Save snippet error:", err);
    }
  };

  // 11. Delete Snippet
  const deleteSnippet = async (snippetId: string) => {
    if (!activeWorkspace) return;
    try {
      const success = await api.deleteSnippet(activeWorkspace.id, snippetId);
      if (success) {
        setSharedSnippets((prev) => prev.filter((s) => s.id !== snippetId));
        // Refresh logs
        const logsRes = await api.listLogs(activeWorkspace.id);
        setAuditLogs(logsRes.logs);
      }
    } catch (err) {
      console.error("Delete snippet error:", err);
    }
  };

  // 12. Log Activity
  const logActivity = async (_action: string, _details: string) => {
    if (!activeWorkspace) return;
    try {
      const logsRes = await api.listLogs(activeWorkspace.id);
      setAuditLogs(logsRes.logs);
    } catch (err) {
      console.error("Log activity refresh error:", err);
    }
  };

  // 13. Toggle Favorite Tool
  const toggleFavoriteTool = async (toolId: string) => {
    if (!profile) return;
    const current = profile.favoriteTools || [];
    const next = current.includes(toolId) ? current.filter((id) => id !== toolId) : [...current, toolId];
    await updateUserProfile({ favoriteTools: next });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        activeWorkspace,
        workspaces,
        sharedSnippets,
        auditLogs,
        loginWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        updateUserProfile,
        logout,
        createWorkspace,
        switchWorkspace,
        inviteMember,
        saveSnippet,
        deleteSnippet,
        logActivity,
        toggleFavoriteTool,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
