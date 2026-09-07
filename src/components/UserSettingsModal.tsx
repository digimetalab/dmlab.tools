import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User as UserIcon,
  Mail,
  Shield,
  Crown,
  Sparkles,
  Check,
  X,
  Building2,
  Calendar,
  Layers,
  Heart,
  Save,
  LogOut,
  Sliders,
} from 'lucide-react';
import type { PlanTier } from '../types';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWorkspaces: () => void;
}

export function UserSettingsModal({ isOpen, onClose, onOpenWorkspaces }: UserSettingsModalProps) {
  const { user, profile, activeWorkspace, updateUserProfile, logout } = useAuth();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || '');
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>(profile?.plan || 'pro');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'plan' | 'preferences'>('profile');

  React.useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setPhotoURL(profile.photoURL || '');
      setSelectedPlan(profile.plan || 'pro');
    }
  }, [profile, isOpen]);

  if (!isOpen || !user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const success = await updateUserProfile({
      displayName: displayName.trim(),
      photoURL: photoURL.trim(),
      plan: selectedPlan,
    });
    setIsSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#EBECF0] dark:bg-[#1E222B] neu-raised-lg border border-white/40 dark:border-white/5 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#D1D9E6]/60 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl neu-convex flex items-center justify-center text-[#6C63FF] overflow-hidden">
              {photoURL ? (
                <img src={photoURL} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[#2D3748] dark:text-slate-100">
                  {profile?.displayName || 'User Profile'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#6C63FF]/15 text-[#6C63FF] dark:text-[#8C82FF]">
                  {profile?.plan?.toUpperCase() || 'PRO'} USER
                </span>
              </div>
              <p className="text-xs text-[#718096] dark:text-slate-400 font-mono">
                {profile?.email || user.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl neu-btn-convex text-[#718096] hover:text-[#2D3748] dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-[#D1D9E6]/60 dark:border-slate-800 bg-[#EBECF0]/50 dark:bg-[#1A1D24]/50">
          {[
            { id: 'profile', label: 'User Profile', icon: UserIcon },
            { id: 'plan', label: 'Plan & Tier', icon: Crown },
            { id: 'preferences', label: 'App Preferences', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#6C63FF] text-[#6C63FF] dark:text-[#8C82FF]'
                    : 'border-transparent text-[#718096] hover:text-[#2D3748] dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#64748B]">Display Name</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep text-xs text-[#2D3748] dark:text-slate-100 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#64748B]">Email Address (Account ID)</label>
                  <input
                    type="email"
                    disabled
                    value={profile?.email || user.email || ''}
                    className="w-full px-4 py-2.5 rounded-xl neu-pressed-sm text-xs text-[#718096] font-mono opacity-80 cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#64748B]">Avatar Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep text-xs text-[#2D3748] dark:text-slate-100 outline-none"
                />
              </div>

              {/* Account Meta Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl neu-flat space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#718096]">Account Role</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D3748] dark:text-slate-100">
                    <Shield className="w-3.5 h-3.5 text-[#6C63FF]" />
                    <span className="capitalize">{profile?.role || 'Owner'}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl neu-flat space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#718096]">Active Workspace</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D3748] dark:text-slate-100 truncate">
                    <Building2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{activeWorkspace?.name || 'Personal'}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl neu-flat space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#718096]">Joined SaaS</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D3748] dark:text-slate-100">
                    <Calendar className="w-3.5 h-3.5 text-[#718096]" />
                    <span>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Active'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#D1D9E6]/60 dark:border-slate-800">
                {saveSuccess ? (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Profile changes saved successfully!
                  </span>
                ) : (
                  <span className="text-[11px] text-[#718096]">Settings sync across all signed-in sessions.</span>
                )}

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs neu-btn-primary inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PLAN & TIER */}
          {activeTab === 'plan' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    id: 'free',
                    name: 'Free Starter',
                    price: '$0',
                    desc: 'Standard developer toolbox',
                    features: ['Access 67+ tools', 'Local state storage', '1 Workspace', 'Community support'],
                  },
                  {
                    id: 'pro',
                    name: 'Pro Developer',
                    price: '$12/mo',
                    badge: 'Current Plan',
                    desc: 'Full team collaboration',
                    features: ['All 67+ Tools & AI Suite', 'Cloud Team Vault Sync', 'Unlimited Workspaces', 'Live Audit Logs', 'High Priority API'],
                  },
                  {
                    id: 'enterprise',
                    name: 'Enterprise SaaS',
                    price: '$49/mo',
                    desc: 'Custom organization security',
                    features: ['Custom RBAC permissions', 'Dedicated database isolate', 'Audit retention', 'SLA 99.9% uptime', '24/7 dedicated support'],
                  },
                ].map((tier) => {
                  const isCurrent = (profile?.plan || 'pro') === tier.id;
                  return (
                    <div
                      key={tier.id}
                      className={`p-5 rounded-2xl flex flex-col justify-between space-y-4 transition-all ${
                        isCurrent
                          ? 'neu-tab-active border-2 border-[#6C63FF]'
                          : 'neu-flat'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-[#2D3748] dark:text-slate-100">{tier.name}</h4>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#6C63FF] text-white">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="text-lg font-black text-[#6C63FF] dark:text-[#8C82FF]">{tier.price}</div>
                        <p className="text-[11px] text-[#718096]">{tier.desc}</p>
                        <div className="space-y-1.5 pt-2">
                          {tier.features.map((feat, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[10px] text-[#475569] dark:text-slate-300">
                              <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {!isCurrent && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPlan(tier.id as PlanTier);
                            updateUserProfile({ plan: tier.id as PlanTier });
                          }}
                          className="w-full py-2 rounded-xl text-xs font-bold neu-btn-convex text-[#6C63FF] hover:bg-[#6C63FF]/10 cursor-pointer"
                        >
                          Select {tier.name}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl neu-flat flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#2D3748] dark:text-slate-100">Manage Team Workspaces</h4>
                  <p className="text-[11px] text-[#718096]">Switch workspaces, invite colleagues, or view team audit trail.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenWorkspaces();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold neu-btn-primary cursor-pointer"
                >
                  Open Workspaces
                </button>
              </div>

              <div className="p-4 rounded-2xl neu-flat flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Account Logout</h4>
                  <p className="text-[11px] text-[#718096]">Sign out of your account on this browser.</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 neu-btn-convex hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 inline mr-1" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
