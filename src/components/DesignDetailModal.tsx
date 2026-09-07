import React, { useState } from 'react';
import { DesignSystemItem } from '../types';
import {
  X,
  Copy,
  Check,
  Download,
  Palette,
  Eye,
  Sliders,
  CheckCircle2,
  Bookmark,
  Layers,
  Sparkles,
  Code2,
} from 'lucide-react';

interface DesignDetailModalProps {
  design: DesignSystemItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveToVault?: (title: string, content: string, type: 'design') => void;
}

export const DesignDetailModal: React.FC<DesignDetailModalProps> = ({
  design,
  isOpen,
  onClose,
  onSaveToVault,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedTokens, setCopiedTokens] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'tokens' | 'raw'>('overview');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !design) return null;

  const handleCopy = (text: string, isTokens = false) => {
    navigator.clipboard.writeText(text);
    if (isTokens) {
      setCopiedTokens(true);
      setTimeout(() => setCopiedTokens(false), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([design.rawMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${design.slug}.DESIGN.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleVaultSave = () => {
    if (onSaveToVault) {
      onSaveToVault(`${design.name} (DESIGN.md)`, design.rawMarkdown, 'design');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[32px] neu-flat bg-[#EBECF0] dark:bg-[#1E222B] border border-white/50 dark:border-white/5 shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="p-6 pb-4 border-b border-[#D1D9E6]/60 dark:border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-2xl neu-convex flex items-center justify-center shrink-0"
              style={{ color: design.primaryColor }}
            >
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#1E293B] dark:text-white">
                  {design.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#6C63FF]/20 text-[#6C63FF]">
                  {design.archetype}
                </span>
                {design.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    {design.badge}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-300 mt-1">
                {design.tagline}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl neu-convex-sm flex items-center justify-center text-[#64748B] hover:text-[#1E293B] dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher & Quick Actions */}
        <div className="px-6 py-3 bg-[#E2E5EC]/50 dark:bg-[#171A21]/50 border-b border-[#D1D9E6]/50 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl neu-pressed-deep">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'neu-convex text-[#6C63FF]'
                  : 'text-[#64748B] hover:text-[#1E293B] dark:hover:text-white'
              }`}
            >
              Spec & Anti-Slop
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tokens')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'tokens'
                  ? 'neu-convex text-[#6C63FF]'
                  : 'text-[#64748B] hover:text-[#1E293B] dark:hover:text-white'
              }`}
            >
              CSS & Tailwind Tokens
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('raw')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'raw'
                  ? 'neu-convex text-[#6C63FF]'
                  : 'text-[#64748B] hover:text-[#1E293B] dark:hover:text-white'
              }`}
            >
              Raw DESIGN.md
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopy(design.rawMarkdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-convex-sm text-xs font-bold text-[#6C63FF] hover:scale-[1.02] cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy DESIGN.md'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-convex-sm text-xs font-bold text-[#1E293B] dark:text-slate-200 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {onSaveToVault && (
              <button
                type="button"
                onClick={handleVaultSave}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-btn-primary text-xs font-bold cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{savedSuccess ? 'Saved!' : 'Save to Vault'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Visual Swatches & Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl neu-pressed-deep flex flex-col justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-[#64748B]">Primary Color</span>
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className="w-5 h-5 rounded-lg border border-black/10 shadow-xs"
                      style={{ backgroundColor: design.primaryColor }}
                    />
                    <span className="font-mono text-xs font-bold text-[#1E293B] dark:text-white">
                      {design.primaryColor}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl neu-pressed-deep flex flex-col justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-[#64748B]">Accent Color</span>
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className="w-5 h-5 rounded-lg border border-black/10 shadow-xs"
                      style={{ backgroundColor: design.accentColor }}
                    />
                    <span className="font-mono text-xs font-bold text-[#1E293B] dark:text-white">
                      {design.accentColor}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl neu-pressed-deep flex flex-col justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-[#64748B]">Contrast Ratio</span>
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                    {design.contrastRatio}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl neu-pressed-deep flex flex-col justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-[#64748B]">Type Ratio</span>
                  <span className="font-mono text-xs font-bold text-[#6C63FF] mt-2">
                    {design.mathScale.split('/')[0]}
                  </span>
                </div>
              </div>

              {/* Typography Specs */}
              <div className="p-4 rounded-2xl neu-flat space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#6C63FF] flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Typography Pairings</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl neu-pressed-deep">
                    <span className="text-[10px] font-bold text-[#64748B] block">Headings & Display:</span>
                    <span className="text-xs font-bold text-[#1E293B] dark:text-white font-display">
                      {design.typographyHeading}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl neu-pressed-deep">
                    <span className="text-[10px] font-bold text-[#64748B] block">Body & UI Elements:</span>
                    <span className="text-xs font-bold text-[#1E293B] dark:text-white">
                      {design.typographyBody}
                    </span>
                  </div>
                </div>
              </div>

              {/* Anti-Slop Strict Rules Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Anti-Slop Craftsmanship Checklist</span>
                </h4>
                <div className="space-y-2">
                  {design.antiSlopRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl neu-flat flex items-start gap-2.5 text-xs text-[#1E293B] dark:text-slate-200"
                    >
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tokens' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B]">
                    Tailwind CSS Configuration Tokens
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleCopy(design.tailwindTokens, true)}
                    className="text-[11px] font-bold text-[#6C63FF] hover:underline cursor-pointer"
                  >
                    Copy Tailwind Config
                  </button>
                </div>
                <pre className="p-4 rounded-2xl neu-pressed-deep font-mono text-xs text-[#1E293B] dark:text-cyan-400 overflow-x-auto whitespace-pre-wrap">
                  {design.tailwindTokens}
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B]">
                    CSS Variables (:root)
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleCopy(design.cssVariables, true)}
                    className="text-[11px] font-bold text-[#6C63FF] hover:underline cursor-pointer"
                  >
                    Copy CSS Variables
                  </button>
                </div>
                <pre className="p-4 rounded-2xl neu-pressed-deep font-mono text-xs text-[#1E293B] dark:text-amber-400 overflow-x-auto whitespace-pre-wrap">
                  {design.cssVariables}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#64748B]">
                <span>Full DESIGN.md Source File</span>
                <button
                  type="button"
                  onClick={() => handleCopy(design.rawMarkdown)}
                  className="font-bold text-[#6C63FF] hover:underline cursor-pointer"
                >
                  {copied ? 'Copied!' : 'Copy All'}
                </button>
              </div>
              <textarea
                readOnly
                value={design.rawMarkdown}
                className="w-full h-96 p-4 rounded-2xl neu-pressed-deep font-mono text-xs text-[#1E293B] dark:text-slate-100 outline-none resize-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
