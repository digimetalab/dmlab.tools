import React, { useState } from 'react';
import { ToolItem, ToolCategory, AgentSkillItem, DesignSystemItem, McpServerItem, MarketplaceTab } from '../types';
import { CATEGORIES } from '../data/toolsData';
import { SKILLS_DATA } from '../data/skillsData';
import { DESIGN_DATA } from '../data/designData';
import { MCP_DATA } from '../data/mcpData';
import { DynamicIcon } from '../utils/iconHelper';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  Layers,
  Cpu,
  MousePointerClick,
  Sliders,
  CheckCircle2,
  Building2,
  Users,
  User,
  Lock,
  Code2,
  Palette,
  Server,
  FileCode,
  Terminal,
  ExternalLink,
  Bookmark,
  Check,
  Copy,
} from 'lucide-react';

interface LandingPageProps {
  onSelectTool: (tool: ToolItem) => void;
  onExploreAll: (category?: ToolCategory) => void;
  onSelectSkill: (skill: AgentSkillItem) => void;
  onSelectDesign: (design: DesignSystemItem) => void;
  onSelectMcp: (mcp: McpServerItem) => void;
  onExploreMarketplaceTab?: (tab: MarketplaceTab) => void;
  tools: ToolItem[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpenAuth?: (tab: 'signin' | 'signup') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectTool,
  onExploreAll,
  onSelectSkill,
  onSelectDesign,
  onSelectMcp,
  onExploreMarketplaceTab,
  tools,
  favorites,
  onToggleFavorite,
  onOpenAuth,
}) => {
  const [heroSearch, setHeroSearch] = useState('');
  const [activeMarketplaceTab, setActiveMarketplaceTab] = useState<MarketplaceTab>('all');

  // Interactive Live Neumorphic Demo Workbench State
  const [demoText, setDemoText] = useState('tactile neumorphic soft ui');
  const [demoCaseType, setDemoCaseType] = useState<'camel' | 'kebab' | 'upper' | 'title'>('camel');

  const getConvertedDemoText = () => {
    if (demoCaseType === 'upper') return demoText.toUpperCase();
    if (demoCaseType === 'kebab') return demoText.toLowerCase().replace(/\s+/g, '-');
    if (demoCaseType === 'title') {
      return demoText.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
    return demoText
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  };

  // Multi-ecosystem search filtering
  const searchLower = heroSearch.toLowerCase().trim();

  const matchingTools = searchLower
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower) ||
          t.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      ).slice(0, 3)
    : [];

  const matchingSkills = searchLower
    ? SKILLS_DATA.filter(
        (s) =>
          s.name.toLowerCase().includes(searchLower) ||
          s.tagline.toLowerCase().includes(searchLower) ||
          s.tags.some((t) => t.toLowerCase().includes(searchLower))
      ).slice(0, 3)
    : [];

  const matchingDesigns = searchLower
    ? DESIGN_DATA.filter(
        (d) =>
          d.name.toLowerCase().includes(searchLower) ||
          d.tagline.toLowerCase().includes(searchLower) ||
          d.tags.some((t) => t.toLowerCase().includes(searchLower))
      ).slice(0, 3)
    : [];

  const matchingMcps = searchLower
    ? MCP_DATA.filter(
        (m) =>
          m.name.toLowerCase().includes(searchLower) ||
          m.tagline.toLowerCase().includes(searchLower) ||
          m.tags.some((t) => t.toLowerCase().includes(searchLower))
      ).slice(0, 3)
    : [];

  const hasSearchHits =
    matchingTools.length > 0 ||
    matchingSkills.length > 0 ||
    matchingDesigns.length > 0 ||
    matchingMcps.length > 0;

  const featuredTools = tools.filter((t) =>
    ['json-formatter', 'box-shadow', 'case-converter', 'base64-text', 'color-palette', 'ai-regex', 'lorem-generator', 'svg-data-uri'].includes(t.id)
  );

  return (
    <div className="w-full space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION - UNIFIED AI & DEV MARKETPLACE */}
      <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-16 px-6 sm:px-10 rounded-[32px] neu-flat overflow-hidden">
        {/* Concentric Ambient Neumorphic Rings Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full neu-pressed-deep pointer-events-none opacity-20 hidden sm:block" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full neu-convex pointer-events-none opacity-25 hidden sm:block" />

        {/* Floating Ambient Neumorphic Spheres */}
        <div className="absolute top-10 left-10 w-14 h-14 rounded-2xl neu-convex flex items-center justify-center animate-neu-float hidden lg:flex">
          <Sparkles className="w-6 h-6 text-[#6C63FF]" />
        </div>
        <div className="absolute bottom-10 right-10 w-16 h-16 rounded-2xl neu-convex flex items-center justify-center animate-neu-float-delayed hidden lg:flex">
          <Server className="w-7 h-7 text-cyan-500" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6 z-10">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full neu-convex-sm text-xs font-bold text-[#1E293B] dark:text-slate-200">
            <div className="w-2.5 h-2.5 rounded-full bg-[#6C63FF] shadow-[0_0_8px_#6C63FF]" />
            <span className="tracking-wide">Marketplace for AI Agents, Dev Tools & Design Systems</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-3">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1E293B] dark:text-slate-100 leading-[1.15]">
              The Unified Ecosystem for <br />
              <span className="text-[#6C63FF] dark:text-[#8B84FF]">AI Agents, Devs & Designers</span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#475569] dark:text-slate-300 font-medium leading-relaxed">
              Explore curated <strong>AI Agent Skills (SKILL.md)</strong>, mathematical <strong>Design Guidelines (DESIGN.md)</strong>, <strong>Model Context Protocol (MCP)</strong> servers, and <strong>67+ tactile developer tools</strong> with 1-click setup.
            </p>
          </div>

          {/* Deep Search Bar Across All Ecosystems */}
          <div className="max-w-2xl mx-auto space-y-3 pt-2">
            <div className="relative">
              <Search className="w-5 h-5 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search across Tools, Skills (SKILL.md), Design Systems, and MCP Servers..."
                className="w-full neu-pressed-deep text-[#1E293B] dark:text-slate-100 placeholder:text-[#64748B] rounded-2xl py-4 pl-12 pr-12 text-xs sm:text-sm outline-none transition-all"
              />
              {heroSearch && (
                <button
                  type="button"
                  onClick={() => setHeroSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full neu-convex-xs flex items-center justify-center text-xs font-bold text-[#64748B] hover:text-[#1E293B] cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Instant Cross-Ecosystem Search Suggestions */}
            {heroSearch.trim() && hasSearchHits && (
              <div className="p-4 neu-flat rounded-2xl text-left space-y-4 animate-in fade-in duration-200 shadow-2xl">
                {matchingSkills.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-[#6C63FF] tracking-wider block">
                      AI Agent Skills (SKILL.md)
                    </span>
                    {matchingSkills.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => onSelectSkill(s)}
                        className="w-full px-3 py-2 rounded-xl neu-convex-hover flex items-center justify-between text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Sparkles className="w-4 h-4 text-[#6C63FF]" />
                          <span className="text-xs font-bold text-[#1E293B] dark:text-white group-hover:text-[#6C63FF]">
                            {s.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#64748B] font-mono">v{s.version}</span>
                      </button>
                    ))}
                  </div>
                )}

                {matchingDesigns.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-amber-500 tracking-wider block">
                      Design Systems (DESIGN.md)
                    </span>
                    {matchingDesigns.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => onSelectDesign(d)}
                        className="w-full px-3 py-2 rounded-xl neu-convex-hover flex items-center justify-between text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Palette className="w-4 h-4 text-amber-500" />
                          <span className="text-xs font-bold text-[#1E293B] dark:text-white group-hover:text-amber-500">
                            {d.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#64748B] font-mono">{d.archetype}</span>
                      </button>
                    ))}
                  </div>
                )}

                {matchingMcps.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-cyan-500 tracking-wider block">
                      MCP Servers (Model Context Protocol)
                    </span>
                    {matchingMcps.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => onSelectMcp(m)}
                        className="w-full px-3 py-2 rounded-xl neu-convex-hover flex items-center justify-between text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Server className="w-4 h-4 text-cyan-500" />
                          <span className="text-xs font-bold text-[#1E293B] dark:text-white group-hover:text-cyan-500">
                            {m.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#64748B] font-mono">{m.transport.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                )}

                {matchingTools.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-500 tracking-wider block">
                      Developer Tools
                    </span>
                    {matchingTools.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => onSelectTool(t)}
                        className="w-full px-3 py-2 rounded-xl neu-convex-hover flex items-center justify-between text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <DynamicIcon name={t.icon} className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs font-bold text-[#1E293B] dark:text-white group-hover:text-emerald-500">
                            {t.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#64748B]">{t.category}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4 Interactive Marketplace Pillar Cards - Reordered, Pixel-Perfect Consistency, Eye-Catching & Tactile */}
            <div className="pt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto w-full">
              {/* 1. AI Agent Skills */}
              <button
                type="button"
                onClick={() => setActiveMarketplaceTab('skills')}
                className={`group relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl transition-all duration-200 cursor-pointer text-left flex flex-col justify-between min-h-[140px] sm:min-h-[155px] ${
                  activeMarketplaceTab === 'skills'
                    ? 'neu-pressed ring-2 ring-[#8B5CF6]/50 bg-gradient-to-b from-[#8B5CF6]/10 to-transparent shadow-inner'
                    : 'neu-convex neu-convex-hover hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl neu-pressed-deep flex items-center justify-center text-[#8B5CF6] shrink-0 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <span className="whitespace-nowrap px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#8B5CF6]/15 text-[#8B5CF6] dark:text-[#A78BFA] border border-[#8B5CF6]/30">
                    SKILL.MD
                  </span>
                </div>

                <div className="space-y-0.5 pt-3">
                  <div className="text-xl sm:text-2xl lg:text-[26px] font-extrabold font-display text-[#8B5CF6] dark:text-[#A78BFA] tracking-tight whitespace-nowrap leading-tight">
                    {SKILLS_DATA.length} Skills
                  </div>
                  <div className="text-[11px] sm:text-xs font-extrabold text-[#1E293B] dark:text-slate-200 uppercase tracking-wider whitespace-nowrap">
                    AI Agent Skills
                  </div>
                  <div className="text-[10px] font-medium text-[#64748B] dark:text-slate-400 whitespace-nowrap">
                    Claude, Cursor & AI Studio
                  </div>
                </div>
              </button>

              {/* 2. Design Systems */}
              <button
                type="button"
                onClick={() => setActiveMarketplaceTab('design')}
                className={`group relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl transition-all duration-200 cursor-pointer text-left flex flex-col justify-between min-h-[140px] sm:min-h-[155px] ${
                  activeMarketplaceTab === 'design'
                    ? 'neu-pressed ring-2 ring-amber-500/50 bg-gradient-to-b from-amber-500/10 to-transparent shadow-inner'
                    : 'neu-convex neu-convex-hover hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl neu-pressed-deep flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-105 transition-transform">
                    <Palette className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <span className="whitespace-nowrap px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    DESIGN.MD
                  </span>
                </div>

                <div className="space-y-0.5 pt-3">
                  <div className="text-xl sm:text-2xl lg:text-[26px] font-extrabold font-display text-amber-500 dark:text-amber-400 tracking-tight whitespace-nowrap leading-tight">
                    {DESIGN_DATA.length} Systems
                  </div>
                  <div className="text-[11px] sm:text-xs font-extrabold text-[#1E293B] dark:text-slate-200 uppercase tracking-wider whitespace-nowrap">
                    Design Tokens
                  </div>
                  <div className="text-[10px] font-medium text-[#64748B] dark:text-slate-400 whitespace-nowrap">
                    Anti-Slop UI & Typography
                  </div>
                </div>
              </button>

              {/* 3. MCP Servers */}
              <button
                type="button"
                onClick={() => setActiveMarketplaceTab('mcp')}
                className={`group relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl transition-all duration-200 cursor-pointer text-left flex flex-col justify-between min-h-[140px] sm:min-h-[155px] ${
                  activeMarketplaceTab === 'mcp'
                    ? 'neu-pressed ring-2 ring-cyan-500/50 bg-gradient-to-b from-cyan-500/10 to-transparent shadow-inner'
                    : 'neu-convex neu-convex-hover hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl neu-pressed-deep flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Server className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <span className="whitespace-nowrap px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                    PROTOCOL
                  </span>
                </div>

                <div className="space-y-0.5 pt-3">
                  <div className="text-xl sm:text-2xl lg:text-[26px] font-extrabold font-display text-cyan-600 dark:text-cyan-400 tracking-tight whitespace-nowrap leading-tight">
                    {MCP_DATA.length} MCPs
                  </div>
                  <div className="text-[11px] sm:text-xs font-extrabold text-[#1E293B] dark:text-slate-200 uppercase tracking-wider whitespace-nowrap">
                    MCP Servers
                  </div>
                  <div className="text-[10px] font-medium text-[#64748B] dark:text-slate-400 whitespace-nowrap">
                    JSON Presets & CLI Runner
                  </div>
                </div>
              </button>

              {/* 4. Dev Utilities (Far Right!) */}
              <button
                type="button"
                onClick={() => setActiveMarketplaceTab('tools')}
                className={`group relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl transition-all duration-200 cursor-pointer text-left flex flex-col justify-between min-h-[140px] sm:min-h-[155px] ${
                  activeMarketplaceTab === 'tools'
                    ? 'neu-pressed ring-2 ring-emerald-500/50 bg-gradient-to-b from-emerald-500/10 to-transparent shadow-inner'
                    : 'neu-convex neu-convex-hover hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl neu-pressed-deep flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-105 transition-transform">
                    <Code2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <span className="whitespace-nowrap px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    UTILITIES
                  </span>
                </div>

                <div className="space-y-0.5 pt-3">
                  <div className="text-xl sm:text-2xl lg:text-[26px] font-extrabold font-display text-emerald-600 dark:text-emerald-400 tracking-tight whitespace-nowrap leading-tight">
                    {tools.length}+ Tools
                  </div>
                  <div className="text-[11px] sm:text-xs font-extrabold text-[#1E293B] dark:text-slate-200 uppercase tracking-wider whitespace-nowrap">
                    Dev Utilities
                  </div>
                  <div className="text-[10px] font-medium text-[#64748B] dark:text-slate-400 whitespace-nowrap">
                    Zero-Latency Offline Toolbox
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MARKETPLACE ECOSYSTEM SELECTOR TABS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#cbd5e1]/40 dark:border-slate-800">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1E293B] dark:text-white">
              Marketplace Hubs
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 mt-1">
              Filter curated setups, YAML prompts, design token specifications, MCP configs, and dev tools.
            </p>
          </div>

          {/* Tactile Tab Selector - Dev Utilities at Far Right */}
          <div className="p-1.5 rounded-2xl neu-pressed-deep flex flex-wrap gap-1.5 self-stretch sm:self-auto">
            {[
              { id: 'all', label: 'All Ecosystems', count: SKILLS_DATA.length + DESIGN_DATA.length + MCP_DATA.length + tools.length, icon: Layers, activeColor: 'text-[#6C63FF]' },
              { id: 'skills', label: 'AI Skills', count: SKILLS_DATA.length, icon: Sparkles, activeColor: 'text-[#8B5CF6]' },
              { id: 'design', label: 'Design Specs', count: DESIGN_DATA.length, icon: Palette, activeColor: 'text-amber-500' },
              { id: 'mcp', label: 'MCP Servers', count: MCP_DATA.length, icon: Server, activeColor: 'text-cyan-600 dark:text-cyan-400' },
              { id: 'tools', label: 'Dev Tools', count: `${tools.length}+`, icon: Code2, activeColor: 'text-emerald-600 dark:text-emerald-400' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeMarketplaceTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveMarketplaceTab(tab.id as MarketplaceTab)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? `neu-convex ${tab.activeColor} shadow-sm font-extrabold`
                      : 'text-[#64748B] hover:text-[#1E293B] dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                    isActive ? 'bg-black/10 dark:bg-white/10 font-bold' : 'neu-pressed-sm text-[#64748B]'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- PILLAR A: AI AGENT SKILLS MARKETPLACE (SKILL.MD) --- */}
        {(activeMarketplaceTab === 'all' || activeMarketplaceTab === 'skills') && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl neu-convex flex items-center justify-center text-[#6C63FF]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#1E293B] dark:text-white flex items-center gap-2">
                    <span>AI Agent Skills Marketplace</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#6C63FF]/20 text-[#6C63FF]">
                      SKILL.md Setups
                    </span>
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-slate-400">
                    Ready-to-deploy instructions, YAML frontmatter triggers, and tool assertions for AI Studio, Claude Code, Cursor, and Antigravity.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SKILLS_DATA.map((skill) => (
                <div
                  key={skill.id}
                  onClick={() => onSelectSkill(skill)}
                  className="neu-flat neu-convex-hover rounded-[28px] p-6 flex flex-col justify-between cursor-pointer group space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase neu-convex-xs text-[#6C63FF]">
                        {skill.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#64748B]">v{skill.version}</span>
                    </div>

                    <div>
                      <h4 className="font-display font-bold text-base text-[#1E293B] dark:text-white group-hover:text-[#6C63FF] transition-colors">
                        {skill.name}
                      </h4>
                      <p className="text-xs text-[#64748B] dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {skill.tagline}
                      </p>
                    </div>

                    {/* Agent Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {skill.compatibleWith.slice(0, 2).map((agent) => (
                        <span key={agent} className="px-2 py-0.5 rounded-lg text-[9px] font-bold neu-pressed-sm text-[#475569] dark:text-slate-300">
                          {agent}
                        </span>
                      ))}
                      {skill.compatibleWith.length > 2 && (
                        <span className="px-1.5 py-0.5 rounded-lg text-[9px] font-bold text-[#64748B]">
                          +{skill.compatibleWith.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#D1D9E6]/50 dark:border-slate-800 text-xs font-bold text-[#6C63FF]">
                    <span className="flex items-center gap-1">
                      <FileCode className="w-3.5 h-3.5" /> Inspect SKILL.md
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- PILLAR B: DESIGN SYSTEMS MARKETPLACE (DESIGN.MD) --- */}
        {(activeMarketplaceTab === 'all' || activeMarketplaceTab === 'design') && (
          <div className="space-y-6 pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl neu-convex flex items-center justify-center text-amber-500">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#1E293B] dark:text-white flex items-center gap-2">
                    <span>Design Systems & Tokens Hub</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                      DESIGN.md Specs
                    </span>
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-slate-400">
                    Mathematically verified anti-slop rules, typographic scales, CSS variables, and tactile token configurations.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {DESIGN_DATA.map((design) => (
                <div
                  key={design.id}
                  onClick={() => onSelectDesign(design)}
                  className="neu-flat neu-convex-hover rounded-[28px] p-6 flex flex-col justify-between cursor-pointer group space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase neu-convex-xs text-amber-600 dark:text-amber-400">
                        {design.archetype}
                      </span>
                      <div
                        className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: design.primaryColor }}
                      />
                    </div>

                    <div>
                      <h4 className="font-display font-bold text-sm sm:text-base text-[#1E293B] dark:text-white group-hover:text-amber-500 transition-colors">
                        {design.name}
                      </h4>
                      <p className="text-xs text-[#64748B] dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {design.tagline}
                      </p>
                    </div>

                    {/* Metric pill */}
                    <div className="p-2.5 rounded-xl neu-pressed-deep text-[10px] font-mono text-[#64748B] flex justify-between">
                      <span>Contrast:</span>
                      <strong className="text-[#1E293B] dark:text-slate-200">{design.contrastRatio.split(' ')[0]}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#D1D9E6]/50 dark:border-slate-800 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <span className="flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5" /> View Tokens & Spec
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- PILLAR C: MODEL CONTEXT PROTOCOL (MCP) MARKETPLACE --- */}
        {(activeMarketplaceTab === 'all' || activeMarketplaceTab === 'mcp') && (
          <div className="space-y-6 pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl neu-convex flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#1E293B] dark:text-white flex items-center gap-2">
                    <span>Model Context Protocol (MCP) Hub</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-700 dark:text-cyan-300">
                      Claude & Cursor Setup
                    </span>
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-slate-400">
                    Curated MCP servers with instant JSON configuration generator for Claude Desktop, CLI runner commands, and tool schemas.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MCP_DATA.map((mcp) => (
                <div
                  key={mcp.id}
                  onClick={() => onSelectMcp(mcp)}
                  className="neu-flat neu-convex-hover rounded-[28px] p-6 flex flex-col justify-between cursor-pointer group space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase neu-convex-xs text-cyan-600 dark:text-cyan-400">
                        {mcp.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#64748B]">
                        {mcp.transport.toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-display font-bold text-base text-[#1E293B] dark:text-white group-hover:text-cyan-500 transition-colors">
                        {mcp.name}
                      </h4>
                      <p className="text-xs text-[#64748B] dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {mcp.tagline}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl neu-pressed-deep font-mono text-[10px] text-[#475569] dark:text-slate-300 truncate">
                      {mcp.cliCommand}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#D1D9E6]/50 dark:border-slate-800 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                    <span className="flex items-center gap-1">
                      <Terminal className="w-3.5 h-3.5" /> 1-Click Setup Config
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- PILLAR D: DEVELOPER UTILITIES SUITE --- */}
        {(activeMarketplaceTab === 'all' || activeMarketplaceTab === 'tools') && (
          <div className="space-y-6 pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl neu-convex flex items-center justify-center text-emerald-500">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#1E293B] dark:text-white flex items-center gap-2">
                    <span>Developer & Designer Utilities Suite</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      {tools.length}+ Tools
                    </span>
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-slate-400">
                    Zero-latency client-side transformers, formatters, generators, and tactile calculators.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onExploreAll('all')}
                className="neu-btn-accent px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span>View All {tools.length}+</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredTools.map((tool) => {
                const isFav = favorites.includes(tool.id);
                return (
                  <div
                    key={tool.id}
                    onClick={() => onSelectTool(tool)}
                    className="neu-flat neu-convex-hover rounded-[28px] p-6 flex flex-col items-center text-center cursor-pointer group relative"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(tool.id);
                      }}
                      className={`absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isFav ? 'neu-pressed text-amber-500' : 'neu-convex-xs text-[#64748B] hover:text-amber-500'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>

                    <div className="w-14 h-14 rounded-2xl neu-pressed-deep flex items-center justify-center text-[#6C63FF] mt-2 mb-3 group-hover:scale-105 transition-transform">
                      <DynamicIcon name={tool.icon} className="w-6 h-6" />
                    </div>

                    <h4 className="font-display font-bold text-sm text-[#1E293B] dark:text-white group-hover:text-[#6C63FF] transition-colors mb-1">
                      {tool.name}
                    </h4>
                    <p className="text-xs text-[#64748B] dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* 3. LIVE INTERACTIVE TACTILE SANDBOX */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-extrabold text-[#6C63FF] uppercase tracking-wider">
            Real-Time Physical Sandbox
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1E293B] dark:text-white">
            Instant Execution & Zero-Latency Depth
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400">
            Interact with the controls below to experience live dual-shadow neumorphism and immediate text transformation.
          </p>
        </div>

        <div className="rounded-[32px] neu-flat p-6 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#cbd5e1]/40 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl neu-pressed-deep flex items-center justify-center text-[#6C63FF] font-bold text-lg">
                Aa
              </div>
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-[#1E293B] dark:text-white">
                  Case Converter Sandbox
                </h3>
                <span className="text-xs text-[#64748B]">Live Neumorphic transformer</span>
              </div>
            </div>

            <div className="p-1.5 rounded-2xl neu-pressed-deep flex flex-wrap gap-1.5 self-stretch sm:self-auto">
              {(['camel', 'kebab', 'upper', 'title'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setDemoCaseType(mode)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    demoCaseType === mode
                      ? 'neu-convex text-[#6C63FF] shadow-xs'
                      : 'text-[#64748B] hover:text-[#1E293B] dark:hover:text-white'
                  }`}
                >
                  {mode === 'camel' ? 'camelCase' : mode === 'kebab' ? 'kebab-case' : mode === 'upper' ? 'UPPERCASE' : 'Title Case'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                Type Input Text
              </label>
              <input
                type="text"
                value={demoText}
                onChange={(e) => setDemoText(e.target.value)}
                className="w-full neu-pressed-deep rounded-2xl p-4 text-sm font-mono text-[#1E293B] dark:text-white outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                Transformed Output
              </label>
              <div className="w-full neu-pressed rounded-2xl p-4 text-sm font-mono font-bold text-[#6C63FF] dark:text-[#8B84FF] truncate select-all">
                {getConvertedDemoText()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MULTI-USER SAAS & TEAM COLLABORATION BANNER */}
      <section className="neu-flat rounded-[32px] p-8 sm:p-10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full neu-convex-sm text-[11px] font-bold text-[#6C63FF]">
              <Building2 className="w-3.5 h-3.5" />
              <span>Multi-Tenant Workspaces & Snippet Vault</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1E293B] dark:text-white">
              Collaborate & Share Setups in Real-Time
            </h3>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-300 leading-relaxed">
              Create unlimited team workspaces, save custom <code>SKILL.md</code> configurations, design tokens, and MCP connection settings directly into your shared cloud vault.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onOpenAuth && (
              <button
                type="button"
                onClick={() => onOpenAuth('signin')}
                className="px-6 py-3 rounded-2xl neu-btn-primary text-xs font-black flex items-center gap-2 cursor-pointer shadow-md"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Sign Up</span>
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
