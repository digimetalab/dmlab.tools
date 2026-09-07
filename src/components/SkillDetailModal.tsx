import React, { useState } from 'react';
import { AgentSkillItem } from '../types';
import {
  X,
  Copy,
  Check,
  Download,
  Sparkles,
  Zap,
  Terminal,
  Shield,
  Layers,
  Share2,
  Bookmark,
  ExternalLink,
  Code2,
} from 'lucide-react';

interface SkillDetailModalProps {
  skill: AgentSkillItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveToVault?: (title: string, content: string, type: 'skill') => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({
  skill,
  isOpen,
  onClose,
  onSaveToVault,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedFrontmatter, setCopiedFrontmatter] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'raw' | 'setup'>('overview');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !skill) return null;

  const fullMarkdownContent = `${skill.yamlFrontmatter}\n\n${skill.rawMarkdown}`;

  const handleCopy = (text: string, isFrontmatter = false) => {
    navigator.clipboard.writeText(text);
    if (isFrontmatter) {
      setCopiedFrontmatter(true);
      setTimeout(() => setCopiedFrontmatter(false), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([fullMarkdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${skill.slug}.SKILL.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleVaultSave = () => {
    if (onSaveToVault) {
      onSaveToVault(`${skill.name} (SKILL.md)`, fullMarkdownContent, 'skill');
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
            <div className="w-12 h-12 rounded-2xl neu-convex flex items-center justify-center text-[#6C63FF] shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#1E293B] dark:text-white">
                  {skill.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#6C63FF]/20 text-[#6C63FF]">
                  v{skill.version}
                </span>
                {skill.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    {skill.badge}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-300 mt-1">
                {skill.tagline}
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
              Overview & Triggers
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
              Raw SKILL.md
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('setup')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'setup'
                  ? 'neu-convex text-[#6C63FF]'
                  : 'text-[#64748B] hover:text-[#1E293B] dark:hover:text-white'
              }`}
            >
              Setup & Agents
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopy(fullMarkdownContent)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-convex-sm text-xs font-bold text-[#6C63FF] hover:scale-[1.02] cursor-pointer"
              title="Copy SKILL.md Markdown"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied MD' : 'Copy SKILL.md'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-convex-sm text-xs font-bold text-[#1E293B] dark:text-slate-200 cursor-pointer"
              title="Download .SKILL.md file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {onSaveToVault && (
              <button
                type="button"
                onClick={handleVaultSave}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl neu-btn-primary text-xs font-bold cursor-pointer"
                title="Save into Team Snippet Vault"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{savedSuccess ? 'Saved to Vault!' : 'Save to Vault'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description & Metadata */}
              <div className="p-4 rounded-2xl neu-pressed-deep space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#6C63FF]">
                  Functional Scope & Overview
                </h4>
                <p className="text-xs sm:text-sm text-[#1E293B] dark:text-slate-200 leading-relaxed">
                  {skill.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#D1D9E6]/50 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-[#64748B]">Compatible Agents:</span>
                  {skill.compatibleWith.map((agent) => (
                    <span
                      key={agent}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold neu-convex-xs text-[#1E293B] dark:text-slate-200"
                    >
                      {agent}
                    </span>
                  ))}
                </div>
              </div>

              {/* Triggers Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Automatic Activation Triggers</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {skill.triggers.map((trigger, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl neu-flat flex items-start gap-2 text-xs text-[#1E293B] dark:text-slate-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF] mt-1.5 shrink-0" />
                      <span>{trigger}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Tools */}
              {skill.requiredTools.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#6C63FF]" />
                    <span>Agent Tools Required</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skill.requiredTools.map((tool) => (
                      <code
                        key={tool}
                        className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold neu-pressed text-[#6C63FF]"
                      >
                        {tool}()
                      </code>
                    ))}
                  </div>
                </div>
              )}

              {/* YAML Frontmatter Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>YAML Frontmatter Metadata</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleCopy(skill.yamlFrontmatter, true)}
                    className="text-[11px] font-bold text-[#6C63FF] hover:underline cursor-pointer"
                  >
                    {copiedFrontmatter ? 'Copied!' : 'Copy YAML'}
                  </button>
                </div>
                <pre className="p-4 rounded-2xl neu-pressed-deep font-mono text-xs text-[#1E293B] dark:text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                  {skill.yamlFrontmatter}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#64748B]">
                <span>Full SKILL.md Source File ({fullMarkdownContent.length} chars)</span>
                <button
                  type="button"
                  onClick={() => handleCopy(fullMarkdownContent)}
                  className="font-bold text-[#6C63FF] hover:underline cursor-pointer"
                >
                  {copied ? 'Copied to Clipboard!' : 'Copy All Text'}
                </button>
              </div>
              <textarea
                readOnly
                value={fullMarkdownContent}
                className="w-full h-96 p-4 rounded-2xl neu-pressed-deep font-mono text-xs text-[#1E293B] dark:text-slate-100 outline-none resize-none"
              />
            </div>
          )}

          {activeTab === 'setup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl neu-flat space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#6C63FF]">
                  Quick Installation in Agent Workspaces
                </h4>
                <p className="text-xs text-[#1E293B] dark:text-slate-200">
                  {skill.quickSetupInstructions}
                </p>
              </div>

              <div className="p-4 rounded-2xl neu-pressed-deep space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B]">
                  1. AI Studio & Antigravity Setup
                </h4>
                <p className="text-xs text-[#475569] dark:text-slate-300">
                  Save this skill into your project under <code className="text-[#6C63FF] font-mono">/skills/system_skills/{skill.slug}/SKILL.md</code>. The agent will automatically detect the YAML frontmatter triggers and invoke the skill when applicable.
                </p>
              </div>

              <div className="p-4 rounded-2xl neu-pressed-deep space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#64748B]">
                  2. Claude Code & Cursor Setup
                </h4>
                <p className="text-xs text-[#475569] dark:text-slate-300">
                  Append the contents of the raw markdown directly into your <code className="text-[#6C63FF] font-mono">CLAUDE.md</code> or <code className="text-[#6C63FF] font-mono">.cursorrules</code> file.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
