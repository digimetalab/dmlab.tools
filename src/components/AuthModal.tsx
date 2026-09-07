import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, Sparkles, AlertCircle, Check, X, Shield, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'signin' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialTab = 'signin' }: AuthModalProps) {
  const { loginWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync tab if initialTab changes
  React.useEffect(() => {
    setActiveTab(initialTab);
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (activeTab === 'signin') {
        await signInWithEmail(email.trim(), password);
        setSuccessMsg('Signed in successfully!');
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        if (!name.trim()) {
          setErrorMsg('Please enter your full name');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        await signUpWithEmail(email.trim(), password, name.trim());
        setSuccessMsg('Account created successfully! Welcome to DMLab SaaS.');
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      console.error(err);
      let msg = err?.message || 'Authentication failed. Please try again.';
      if (msg.includes('already exists') || msg.includes('auth/email-already-in-use')) {
        msg = 'An account with this email already exists. Please switch to Sign In.';
      } else if (msg.includes('Invalid email or password') || msg.includes('auth/invalid-credential')) {
        msg = 'Invalid email or password. If you do not have an account, switch to Sign Up.';
      } else if (msg.includes('Password must be at least') || msg.includes('auth/weak-password')) {
        msg = 'Password is too weak. Please use at least 6 characters.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Google sign-in was cancelled or encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-[#EBECF0] dark:bg-[#1E222B] neu-raised-lg border border-white/40 dark:border-white/5 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#D1D9E6]/60 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neu-convex flex items-center justify-center text-[#6C63FF]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#2D3748] dark:text-slate-100">
                {activeTab === 'signin' ? 'Welcome Back' : 'Create Free Account'}
              </h3>
              <p className="text-xs text-[#718096] dark:text-slate-400">
                {activeTab === 'signin' ? 'Sign in to access your team workspaces' : 'Get access to team vaults, snippets & sync'}
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

        {/* Tab Toggle */}
        <div className="p-4 bg-[#EBECF0]/60 dark:bg-[#1A1D24]/60 border-b border-[#D1D9E6]/40 dark:border-slate-800/80">
          <div className="grid grid-cols-2 p-1 rounded-2xl neu-pressed-deep">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'signin'
                  ? 'neu-tab-active text-[#6C63FF] dark:text-[#8C82FF]'
                  : 'text-[#718096] hover:text-[#2D3748] dark:hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'neu-tab-active text-[#6C63FF] dark:text-[#8C82FF]'
                  : 'text-[#718096] hover:text-[#2D3748] dark:hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Modal Form */}
        <div className="p-6 space-y-5">
          {/* Google 1-Click Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 rounded-2xl neu-btn-convex flex items-center justify-center gap-3 text-xs font-bold text-[#2D3748] dark:text-slate-100 hover:text-[#6C63FF] transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-[#D1D9E6] dark:bg-slate-800" />
            <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider">or with email</span>
            <div className="flex-1 h-[1px] bg-[#D1D9E6] dark:bg-slate-800" />
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-2.5 text-xs text-emerald-600 dark:text-emerald-300 font-bold">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {activeTab === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#64748B] flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep text-xs text-[#2D3748] dark:text-slate-100 outline-none"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#64748B] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </label>
              <input
                type="email"
                required
                placeholder="developer@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep text-xs text-[#2D3748] dark:text-slate-100 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#64748B] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl neu-pressed-deep text-xs text-[#2D3748] dark:text-slate-100 outline-none"
              />
              {activeTab === 'signup' && (
                <span className="text-[10px] text-[#718096]">Must be at least 6 characters</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl font-black text-xs neu-btn-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md mt-2"
            >
              {loading ? (
                <span>Processing...</span>
              ) : activeTab === 'signin' ? (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Create Free SaaS Account</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            {activeTab === 'signin' ? (
              <p className="text-xs text-[#718096]">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup');
                    setErrorMsg(null);
                  }}
                  className="font-bold text-[#6C63FF] hover:underline cursor-pointer"
                >
                  Sign Up Free
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#718096]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signin');
                    setErrorMsg(null);
                  }}
                  className="font-bold text-[#6C63FF] hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
