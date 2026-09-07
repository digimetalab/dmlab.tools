import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Building2,
  Bookmark,
  Activity,
  Plus,
  Trash2,
  ExternalLink,
  Shield,
  Crown,
  UserPlus,
  Check,
  Share2,
  Copy,
  Sparkles,
  Layers,
  Code,
  FolderGit2,
  FileCode2,
} from 'lucide-react';
import type { UserRole } from '../types';

interface SaasWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool?: (toolId: string) => void;
}

export function SaasWorkspaceModal({ isOpen, onClose, onSelectTool }: SaasWorkspaceModalProps) {
  const {
    user,
    profile,
    activeWorkspace,
    workspaces,
    sharedSnippets,
    auditLogs,
    loginWithGoogle,
    logout,
    createWorkspace,
    switchWorkspace,
    inviteMember,
    deleteSnippet,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'snippets' | 'team' | 'audit' | 'workspaces'>('snippets');
  const [newWsName, setNewWsName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('member');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [isCreatingWs, setIsCreatingWs] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCreateWs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    setIsCreatingWs(true);
    const id = await createWorkspace(newWsName.trim());
    if (id) {
      setNewWsName('');
      setActiveTab('workspaces');
    }
    setIsCreatingWs(false);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setIsInviting(true);
    const success = await inviteMember(inviteEmail.trim(), inviteRole);
    if (success) {
      setInviteEmail('');
      setInviteSuccess(true);
      setTimeout(() => setInviteSuccess(false), 3000);
    }
    setIsInviting(false);
  };

  const handleCopySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#EBECF0] dark:bg-[#1E222B] neu-raised-lg border border-white/40 dark:border-white/5 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#D1D9E6]/60 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neu-convex flex items-center justify-center text-[#6C63FF]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-[#2D3748] dark:text-slate-100">
                  {activeWorkspace?.name || 'Multi-User Workspace'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#6C63FF]/15 text-[#6C63FF] dark:text-[#8C82FF]">
                  {activeWorkspace?.plan || 'PRO'} SaaS
                </span>
              </div>
              <p className="text-xs text-[#718096] dark:text-slate-400">
                Collaborative developer workspace, team vault, and audit stream
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                {profile?.photoURL ? (
                  <img
                    src={profile.photoURL}
                    alt={profile.displayName}
                    className="w-8 h-8 rounded-full border border-white/50"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#6C63FF] text-white font-bold flex items-center justify-center text-xs">
                    {profile?.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-bold text-[#2D3748] dark:text-slate-100">{profile?.displayName}</div>
                  <div className="text-[10px] text-[#718096] dark:text-slate-400">{profile?.email}</div>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 neu-btn-convex hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={loginWithGoogle}
                className="px-4 py-2 rounded-xl text-xs font-bold neu-btn-primary flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Sign in with Google</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl neu-btn-convex text-[#718096] hover:text-[#2D3748] dark:hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-[#D1D9E6]/60 dark:border-slate-800 bg-[#EBECF0]/50 dark:bg-[#1A1D24]/50 overflow-x-auto">
          {[
            { id: 'snippets', label: 'Team Snippets & Vault', icon: Bookmark, count: sharedSnippets.length },
            { id: 'team', label: 'Team Members & RBAC', icon: Users, count: activeWorkspace?.members.length || 1 },
            { id: 'workspaces', label: 'Workspaces', icon: FolderGit2, count: workspaces.length },
            { id: 'audit', label: 'Activity Logs', icon: Activity, count: auditLogs.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#6C63FF] text-[#6C63FF] dark:text-[#8C82FF]'
                    : 'border-transparent text-[#718096] hover:text-[#2D3748] dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] neu-pressed-sm font-mono">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {!user ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl neu-convex flex items-center justify-center text-[#6C63FF]">
                <Shield className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-black text-[#2D3748] dark:text-slate-100">
                  Authenticate for Multi-User SaaS Features
                </h3>
                <p className="text-xs text-[#718096] dark:text-slate-400">
                  Sign in with Google to create collaborative team workspaces, save snippets across sessions, invite team members, and audit team activities.
                </p>
              </div>
              <button
                type="button"
                onClick={loginWithGoogle}
                className="px-6 py-3 rounded-2xl font-bold text-xs neu-btn-primary inline-flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Users className="w-4 h-4" />
                <span>Sign in with Google Account</span>
              </button>
            </div>
          ) : (
            <>
              {/* TAB 1: TEAM SNIPPETS & VAULT */}
              {activeTab === 'snippets' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-[#2D3748] dark:text-slate-100">
                        Saved Team Payloads & Snippets
                      </h3>
                      <p className="text-xs text-[#718096] dark:text-slate-400">
                        Synchronized across all team members in {activeWorkspace?.name}
                      </p>
                    </div>
                  </div>

                  {sharedSnippets.length === 0 ? (
                    <div className="p-8 rounded-2xl neu-flat text-center space-y-2">
                      <FileCode2 className="w-8 h-8 mx-auto text-[#718096]" />
                      <p className="text-xs font-bold text-[#718096] dark:text-slate-400">
                        No team snippets saved yet in this workspace.
                      </p>
                      <p className="text-[11px] text-[#A0AEC0] dark:text-slate-500">
                        Click the "Save to Team Vault" button inside any developer tool to share configurations or payloads!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sharedSnippets.map((snippet) => (
                        <div
                          key={snippet.id}
                          className="p-4 rounded-2xl neu-flat space-y-3 flex flex-col justify-between"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-[#6C63FF]/15 text-[#6C63FF]">
                                {snippet.toolName}
                              </span>
                              <span className="text-[10px] text-[#A0AEC0] font-mono">
                                {new Date(snippet.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <h4 className="text-xs font-black text-[#2D3748] dark:text-slate-100 truncate">
                              {snippet.title}
                            </h4>
                            <p className="text-[10px] text-[#718096] dark:text-slate-400">
                              By {snippet.userEmail}
                            </p>
                            <pre className="p-2.5 rounded-xl neu-pressed-deep text-[11px] font-mono text-[#2D3748] dark:text-slate-200 max-h-24 overflow-y-auto whitespace-pre-wrap break-all">
                              {snippet.content}
                            </pre>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#D1D9E6]/40 dark:border-slate-800">
                            <button
                              type="button"
                              onClick={() => handleCopySnippet(snippet.id, snippet.content)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold neu-btn-convex inline-flex items-center gap-1 cursor-pointer text-[#2D3748] dark:text-slate-200"
                            >
                              {copiedSnippetId === snippet.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-500" />
                                  <span className="text-emerald-500">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>

                            <div className="flex items-center gap-2">
                              {onSelectTool && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onSelectTool(snippet.toolId);
                                    onClose();
                                  }}
                                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold neu-btn-primary inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <span>Open Tool</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => deleteSnippet(snippet.id)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer transition-colors"
                                title="Delete Snippet"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: TEAM MEMBERS & RBAC */}
              {activeTab === 'team' && (
                <div className="space-y-6">
                  {/* Invite Member Form */}
                  <form onSubmit={handleInvite} className="p-5 rounded-2xl neu-flat space-y-3">
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-[#6C63FF]" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#2D3748] dark:text-slate-100">
                        Invite Team Member to Workspace
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="email"
                        required
                        placeholder="colleague@company.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="sm:col-span-2 px-4 py-2 rounded-xl neu-pressed-deep text-xs text-[#2D3748] dark:text-slate-100 outline-none"
                      />
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as UserRole)}
                        className="px-3 py-2 rounded-xl neu-pressed-deep text-xs font-bold text-[#2D3748] dark:text-slate-100 outline-none bg-transparent"
                      >
                        <option value="member" className="bg-[#EBECF0] dark:bg-[#1E222B]">
                          Member (Editor)
                        </option>
                        <option value="admin" className="bg-[#EBECF0] dark:bg-[#1E222B]">
                          Admin (Manage Team)
                        </option>
                        <option value="viewer" className="bg-[#EBECF0] dark:bg-[#1E222B]">
                          Viewer (Read Only)
                        </option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      {inviteSuccess ? (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Invitation granted successfully!
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#718096] dark:text-slate-400">
                          Members will gain instant access to shared team snippets & configurations.
                        </span>
                      )}
                      <button
                        type="submit"
                        disabled={isInviting || !inviteEmail.trim()}
                        className="px-4 py-2 rounded-xl font-bold text-xs neu-btn-primary inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <span>Send Invite</span>
                      </button>
                    </div>
                  </form>

                  {/* Members List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#718096] dark:text-slate-400">
                      Active Workspace Members ({activeWorkspace?.members.length || 1})
                    </h4>

                    <div className="space-y-2">
                      {activeWorkspace?.members.map((member, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3.5 rounded-2xl neu-flat"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#6C63FF]/20 text-[#6C63FF] font-black flex items-center justify-center text-xs">
                              {member.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#2D3748] dark:text-slate-100">
                                {member.email}
                              </div>
                              <div className="text-[10px] text-[#718096] dark:text-slate-400 font-mono">
                                Joined {new Date(member.joinedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${
                                member.role === 'owner'
                                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                  : member.role === 'admin'
                                  ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                                  : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              }`}
                            >
                              {member.role}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: WORKSPACES */}
              {activeTab === 'workspaces' && (
                <div className="space-y-6">
                  {/* Create Workspace */}
                  <form onSubmit={handleCreateWs} className="flex gap-3">
                    <input
                      type="text"
                      required
                      placeholder="New Workspace Name (e.g. Frontend Team, Alpha Ops)"
                      value={newWsName}
                      onChange={(e) => setNewWsName(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl neu-pressed-deep text-xs text-[#2D3748] dark:text-slate-100 outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isCreatingWs || !newWsName.trim()}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs neu-btn-primary inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Workspace</span>
                    </button>
                  </form>

                  {/* List Workspaces */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#718096] dark:text-slate-400">
                      Your Available Workspaces ({workspaces.length})
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {workspaces.map((ws) => {
                        const isCurrent = ws.id === activeWorkspace?.id;
                        return (
                          <div
                            key={ws.id}
                            className={`p-4 rounded-2xl flex items-center justify-between transition-all ${
                              isCurrent
                                ? 'neu-tab-active border border-[#6C63FF]/30'
                                : 'neu-flat'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h5 className="text-xs font-black text-[#2D3748] dark:text-slate-100">
                                  {ws.name}
                                </h5>
                                {isCurrent && (
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#6C63FF] text-white">
                                    ACTIVE
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-[#718096] dark:text-slate-400">
                                {ws.members.length} Member{ws.members.length > 1 ? 's' : ''} · {ws.plan.toUpperCase()}
                              </p>
                            </div>

                            {!isCurrent && (
                              <button
                                type="button"
                                onClick={() => switchWorkspace(ws.id)}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold neu-btn-convex text-[#6C63FF] dark:text-[#8C82FF] cursor-pointer"
                              >
                                Switch
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: AUDIT LOGS */}
              {activeTab === 'audit' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-[#2D3748] dark:text-slate-100">
                        Workspace Activity & Audit Trail
                      </h3>
                      <p className="text-xs text-[#718096] dark:text-slate-400">
                        Track developer actions, config sharing, and team invitations
                      </p>
                    </div>
                  </div>

                  {auditLogs.length === 0 ? (
                    <div className="p-8 rounded-2xl neu-flat text-center space-y-2">
                      <Activity className="w-8 h-8 mx-auto text-[#718096]" />
                      <p className="text-xs font-bold text-[#718096] dark:text-slate-400">
                        No activity recorded yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {auditLogs.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between p-3.5 rounded-2xl neu-flat text-xs"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#2D3748] dark:text-slate-100">
                                {log.action}
                              </span>
                              <span className="text-[10px] text-[#718096] dark:text-slate-400">
                                by {log.userEmail}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#718096] dark:text-slate-300 font-mono">
                              {log.details}
                            </p>
                          </div>
                          <span className="text-[10px] text-[#A0AEC0] font-mono">
                            {new Date(log.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
