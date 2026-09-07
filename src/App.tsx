import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TOOLS_DATA, CATEGORIES } from './data/toolsData';
import { SKILLS_DATA } from './data/skillsData';
import { DESIGN_DATA } from './data/designData';
import { MCP_DATA } from './data/mcpData';
import { ToolCategory, ToolItem, AgentSkillItem, DesignSystemItem, McpServerItem, MarketplaceTab } from './types';
import { ToolViewer } from './components/ToolViewer';
import { LandingPage } from './components/LandingPage';
import { SaasWorkspaceModal } from './components/SaasWorkspaceModal';
import { AuthModal } from './components/AuthModal';
import { UserSettingsModal } from './components/UserSettingsModal';
import { SkillDetailModal } from './components/SkillDetailModal';
import { DesignDetailModal } from './components/DesignDetailModal';
import { McpDetailModal } from './components/McpDetailModal';
import { useAuth } from './context/AuthContext';
import { DynamicIcon } from './utils/iconHelper';
import {
  getFavorites,
  toggleFavorite as toggleFavStorage,
  getRecents,
  addRecent,
  getTheme,
  setTheme as saveTheme,
} from './utils/storage';
import {
  Search,
  Moon,
  Sun,
  Star,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Zap,
  Home,
  Compass,
  Menu,
  X,
  Building2,
  Users,
  Shield,
  User,
  Settings,
  LogOut,
  ChevronDown,
  UserPlus,
  LogIn,
  Layers,
  Palette,
  Server,
  Code2,
  Terminal,
  FileCode,
} from 'lucide-react';

export default function App() {
  const { user, profile, activeWorkspace, logout, saveSnippet } = useAuth();

  // Navigation & Page State
  const [currentView, setCurrentView] = useState<'landing' | 'workspace'>('landing');
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Marketplace Modals State
  const [selectedSkill, setSelectedSkill] = useState<AgentSkillItem | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<DesignSystemItem | null>(null);
  const [selectedMcp, setSelectedMcp] = useState<McpServerItem | null>(null);

  // SaaS & Auth Modal States
  const [saasModalOpen, setSaasModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'signin' | 'signup'>('signin');
  const [userSettingsOpen, setUserSettingsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Initialize Theme and LocalStorage State
  useEffect(() => {
    const savedTheme = getTheme();
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setFavorites(getFavorites());
    setRecents(getRecents());

    // URL Hash handling for deep linking (e.g. #case-converter)
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== 'home' && hash !== 'landing') {
        const found = TOOLS_DATA.find(t => t.id === hash);
        if (found) {
          setSelectedTool(found);
          setCurrentView('workspace');
          addRecent(found.id);
          setRecents(getRecents());
        }
      } else if (hash === 'tools') {
        setSelectedTool(null);
        setCurrentView('workspace');
      } else {
        setSelectedTool(null);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Theme toggle
  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    saveTheme(next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Select tool and update URL hash
  const handleSelectTool = (tool: ToolItem) => {
    setSelectedTool(tool);
    setCurrentView('workspace');
    window.location.hash = tool.id;
    addRecent(tool.id);
    setRecents(getRecents());
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to Landing Page (Home)
  const handleGoToLanding = () => {
    setSelectedTool(null);
    setCurrentView('landing');
    window.location.hash = '';
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to Workspace Catalog
  const handleExploreAll = (category: ToolCategory = 'all') => {
    setSelectedTool(null);
    setActiveCategory(category);
    setCurrentView('workspace');
    setShowFavoritesOnly(false);
    setMobileMenuOpen(false);
    window.location.hash = 'tools';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to Catalog in Workspace
  const handleBackToDashboard = () => {
    setSelectedTool(null);
    window.location.hash = 'tools';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Favorite
  const handleToggleFavorite = (toolId: string) => {
    const updated = toggleFavStorage(toolId);
    setFavorites(updated);
  };

  // Vault saving handlers
  const handleSaveSkillToVault = async (skill: AgentSkillItem) => {
    await saveSnippet({
      toolId: skill.id,
      toolName: `${skill.name} (SKILL.md)`,
      title: `${skill.name} - Skill Setup`,
      content: skill.rawMarkdown,
      type: 'skill',
    });
  };

  const handleSaveDesignToVault = async (design: DesignSystemItem) => {
    await saveSnippet({
      toolId: design.id,
      toolName: `${design.name} (DESIGN.md)`,
      title: `${design.name} - Design System Spec`,
      content: design.rawMarkdown,
      type: 'design',
    });
  };

  const handleSaveMcpToVault = async (mcp: McpServerItem) => {
    await saveSnippet({
      toolId: mcp.id,
      toolName: `${mcp.name} (MCP Server)`,
      title: `${mcp.name} - MCP Config`,
      content: JSON.stringify(mcp.clientConfigSample.claudeDesktop, null, 2),
      type: 'mcp',
    });
  };

  // Filtered tools
  const filteredTools = useMemo(() => {
    return TOOLS_DATA.filter(tool => {
      // Category check
      if (activeCategory !== 'all' && tool.category !== activeCategory) {
        return false;
      }
      // Favorites only check
      if (showFavoritesOnly && !favorites.includes(tool.id)) {
        return false;
      }
      // Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = tool.name.toLowerCase().includes(q);
        const matchDesc = tool.description.toLowerCase().includes(q);
        const matchTags = tool.tags.some(tag => tag.toLowerCase().includes(q));
        const matchCategory = tool.category.toLowerCase().includes(q);
        return matchName || matchDesc || matchTags || matchCategory;
      }
      return true;
    });
  }, [activeCategory, searchQuery, showFavoritesOnly, favorites]);

  // Favorite items
  const favoriteTools = useMemo(() => {
    return TOOLS_DATA.filter(t => favorites.includes(t.id));
  }, [favorites]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#EBECF0] dark:bg-[#1A1D24] text-[#1D1D1F] dark:text-[#F5F5F7] font-sans selection:bg-[#6C63FF] selection:text-white">
      {/* Neumorphic Header Navigation */}
      <header className="h-[72px] neu-flat sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand & Main Navigation */}
        <div className="flex items-center gap-4 lg:gap-6">
          <button
            type="button"
            onClick={handleGoToLanding}
            className="flex items-center gap-3 group focus:outline-none cursor-pointer"
            title="DMLab Marketplace - Home"
          >
            <div className="w-10 h-10 rounded-2xl neu-convex flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-5 h-5 rounded-lg neu-pressed-deep flex items-center justify-center text-xs font-black text-[#6C63FF]">
                <Zap className="w-3 h-3 fill-[#6C63FF]" />
              </div>
            </div>
            <div className="text-left">
              <span className="font-display text-base sm:text-lg font-extrabold tracking-tight text-[#1E293B] dark:text-white block leading-tight">
                DMLab <span className="text-[#6C63FF] dark:text-[#8B84FF]">Marketplace</span>
              </span>
              <span className="text-[10px] font-bold text-[#64748B] hidden sm:block">
                AI Skills &middot; Design &middot; MCP &middot; Tools
              </span>
            </div>
          </button>

          {/* Primary Navigation Tabs */}
          <nav className="hidden xl:flex items-center gap-1.5 p-1 rounded-2xl neu-pressed-deep">
            <button
              type="button"
              onClick={handleGoToLanding}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'landing' && !selectedTool
                  ? 'neu-convex text-[#6C63FF] shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B] dark:hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Hub / Landing</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (currentView !== 'landing') handleGoToLanding();
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-[#64748B] hover:text-[#6C63FF]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#6C63FF]" />
              <span>AI Skills ({SKILLS_DATA.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (currentView !== 'landing') handleGoToLanding();
                window.scrollTo({ top: 800, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-[#64748B] hover:text-amber-500"
            >
              <Palette className="w-3.5 h-3.5 text-amber-500" />
              <span>Design ({DESIGN_DATA.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (currentView !== 'landing') handleGoToLanding();
                window.scrollTo({ top: 1200, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-[#64748B] hover:text-cyan-500"
            >
              <Server className="w-3.5 h-3.5 text-cyan-500" />
              <span>MCP ({MCP_DATA.length})</span>
            </button>

            <button
              type="button"
              onClick={() => handleExploreAll('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'workspace' && activeCategory === 'all' && !selectedTool && !showFavoritesOnly
                  ? 'neu-convex text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B] dark:hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Tools ({TOOLS_DATA.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowFavoritesOnly(!showFavoritesOnly);
                setCurrentView('workspace');
                if (selectedTool) setSelectedTool(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                showFavoritesOnly
                  ? 'neu-pressed text-amber-500'
                  : 'text-[#64748B] hover:text-amber-500'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-amber-400 text-amber-500' : ''}`} />
              <span>Favorites</span>
              {favorites.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold neu-pressed-sm text-[#6C63FF]">
                  {favorites.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Center: Inset Search Bar (Desktop) */}
        <div className="flex-1 max-w-xs md:max-w-sm lg:max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                if (currentView === 'landing') setCurrentView('workspace');
                if (selectedTool) setSelectedTool(null);
              }}
              placeholder={`Search ${TOOLS_DATA.length}+ tools (JSON, Base64, CSS)...`}
              className="w-full neu-pressed-deep text-[#1E293B] dark:text-slate-100 placeholder:text-[#64748B] rounded-2xl py-2.5 pl-11 pr-10 text-xs outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full neu-convex-xs flex items-center justify-center text-[10px] font-bold text-[#64748B]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions, Auth & User Menu */}
        <div className="flex items-center gap-2.5">
          {/* Favorites Button (visible on smaller screens where nav is hidden) */}
          <button
            id="header-btn-favorites-mobile"
            type="button"
            onClick={() => {
              setShowFavoritesOnly(!showFavoritesOnly);
              setCurrentView('workspace');
              if (selectedTool) setSelectedTool(null);
            }}
            className={`xl:hidden flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              showFavoritesOnly
                ? 'neu-pressed text-amber-500'
                : 'neu-convex-sm text-[#475569] dark:text-slate-300 hover:text-amber-500'
            }`}
            title="Saved Favorites"
          >
            <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-amber-400 text-amber-500' : ''}`} />
            {favorites.length > 0 && (
              <span className="text-[10px] font-bold text-[#6C63FF]">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Theme Switcher Button */}
          <button
            id="header-btn-theme"
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 sm:w-10 sm:h-10 neu-convex-sm rounded-2xl flex items-center justify-center text-[#475569] dark:text-slate-300 hover:text-[#6C63FF] dark:hover:text-[#8B84FF] transition-colors cursor-pointer"
            title="Toggle Light / Dark Neumorphism"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* --- AUTHENTICATION & USER AREA --- */}
          {!user ? (
            /* Logged Out: Single Unified Sign In / Sign Up Button */
            <button
              id="header-btn-auth"
              type="button"
              onClick={() => {
                setAuthInitialTab('signin');
                setAuthModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold neu-btn-primary shadow-sm hover:scale-[1.02] transition-all cursor-pointer"
              title="Sign In or Create an Account"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Sign Up</span>
            </button>
          ) : (
            /* Logged In: Workspace Pill + User Profile Dropdown */
            <div className="flex items-center gap-2 relative" ref={dropdownRef}>
              {/* Workspace Pill */}
              <button
                id="header-btn-workspace"
                type="button"
                onClick={() => setSaasModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold neu-convex-sm text-[#6C63FF] dark:text-[#8C82FF] hover:text-[#5247e6] transition-all cursor-pointer"
                title="Manage Team Workspaces & Vault"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline font-bold max-w-[100px] truncate">
                  {activeWorkspace?.name ? activeWorkspace.name.split(' ')[0] : 'Team Vault'}
                </span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-[#6C63FF]/20 text-[#6C63FF]">
                  {profile?.plan?.toUpperCase() || 'PRO'}
                </span>
              </button>

              {/* User Dropdown Trigger Button */}
              <button
                id="header-btn-user-menu"
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-2xl neu-convex-sm hover:neu-pressed transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-xl neu-pressed-deep flex items-center justify-center text-[#6C63FF] overflow-hidden text-xs font-bold">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    profile?.displayName?.[0]?.toUpperCase() || <User className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className="hidden lg:inline text-xs font-bold text-[#2D3748] dark:text-slate-100 max-w-[90px] truncate">
                  {profile?.displayName || 'User'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#718096] transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu Card */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-12 w-64 p-3 rounded-2xl neu-raised-lg bg-[#EBECF0] dark:bg-[#1E222B] border border-white/50 dark:border-white/5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-2">
                  {/* User Profile Header Card */}
                  <div className="p-2.5 rounded-xl neu-pressed-deep space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#2D3748] dark:text-slate-100 truncate">
                        {profile?.displayName || 'Developer'}
                      </span>
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-[#6C63FF]/20 text-[#6C63FF]">
                        {profile?.role?.toUpperCase() || 'OWNER'}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#718096] dark:text-slate-400 font-mono truncate">
                      {profile?.email || user.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setUserSettingsOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#2D3748] dark:text-slate-200 hover:text-[#6C63FF] hover:neu-convex-xs transition-all cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-[#6C63FF]" />
                      <span>User Settings & Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setSaasModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#2D3748] dark:text-slate-200 hover:text-[#6C63FF] hover:neu-convex-xs transition-all cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Team Workspaces & Vault</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-[#D1D9E6]/60 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            id="header-btn-mobile-menu"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 sm:w-10 sm:h-10 neu-convex-sm rounded-2xl flex xl:hidden items-center justify-center text-[#475569] dark:text-slate-300 hover:text-[#1E293B] dark:hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* --- MODAL DIALOGS --- */}
      {/* 1. Skill Detail Modal */}
      <SkillDetailModal
        skill={selectedSkill}
        isOpen={Boolean(selectedSkill)}
        onClose={() => setSelectedSkill(null)}
        onSaveToVault={handleSaveSkillToVault}
      />

      {/* 2. Design System Detail Modal */}
      <DesignDetailModal
        design={selectedDesign}
        isOpen={Boolean(selectedDesign)}
        onClose={() => setSelectedDesign(null)}
        onSaveToVault={handleSaveDesignToVault}
      />

      {/* 3. MCP Server Detail Modal */}
      <McpDetailModal
        mcp={selectedMcp}
        isOpen={Boolean(selectedMcp)}
        onClose={() => setSelectedMcp(null)}
        onSaveToVault={handleSaveMcpToVault}
      />

      {/* 4. Auth Modal (Sign In / Sign Up) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authInitialTab}
      />

      {/* 5. User Settings Modal */}
      <UserSettingsModal
        isOpen={userSettingsOpen}
        onClose={() => setUserSettingsOpen(false)}
        onOpenWorkspaces={() => setSaasModalOpen(true)}
      />

      {/* 6. SaaS Workspace & Team Modal */}
      <SaasWorkspaceModal
        isOpen={saasModalOpen}
        onClose={() => setSaasModalOpen(false)}
        onSelectTool={toolId => {
          const tool = TOOLS_DATA.find(t => t.id === toolId);
          if (tool) handleSelectTool(tool);
        }}
      />

      {/* Mobile Slide-down Navigation Menu */}
      {mobileMenuOpen && (
        <div className="p-4 neu-flat rounded-b-[32px] xl:hidden space-y-4 shadow-xl z-30 animate-in slide-in-from-top duration-200">
          {/* Mobile Auth Bar */}
          {!user ? (
            <div className="pb-2 border-b border-[#D1D9E6]/60 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthInitialTab('signin');
                  setAuthModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold neu-btn-primary flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Sign Up</span>
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-2xl neu-pressed-deep flex items-center justify-between pb-2 border-b border-[#D1D9E6]/60 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl neu-convex flex items-center justify-center text-[#6C63FF] font-bold text-xs">
                  {profile?.displayName?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#2D3748] dark:text-slate-100">{profile?.displayName}</div>
                  <div className="text-[10px] text-[#718096]">{profile?.plan?.toUpperCase()} Plan</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setUserSettingsOpen(true);
                  }}
                  className="p-2 rounded-xl neu-convex text-[#6C63FF]"
                  title="User Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSaasModalOpen(true);
                  }}
                  className="p-2 rounded-xl neu-convex text-emerald-500"
                  title="Workspaces"
                >
                  <Building2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                handleGoToLanding();
                setMobileMenuOpen(false);
              }}
              className={`p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'landing' && !selectedTool ? 'neu-pressed text-[#6C63FF]' : 'neu-convex-xs text-[#1E293B] dark:text-slate-200'
              }`}
            >
              Hub / Landing
            </button>
            <button
              type="button"
              onClick={() => {
                handleExploreAll('all');
                setMobileMenuOpen(false);
              }}
              className={`p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'workspace' && activeCategory === 'all' ? 'neu-pressed text-[#6C63FF]' : 'neu-convex-xs text-[#1E293B] dark:text-slate-200'
              }`}
            >
              Tools Suite ({TOOLS_DATA.length})
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                if (currentView === 'landing') setCurrentView('workspace');
                if (selectedTool) setSelectedTool(null);
              }}
              placeholder={`Search ${TOOLS_DATA.length}+ tools...`}
              className="w-full neu-pressed-deep text-[#1E293B] dark:text-slate-100 placeholder:text-[#64748B] rounded-2xl py-2.5 pl-11 pr-4 text-xs outline-none"
            />
          </div>

          <div className="space-y-1 pt-2">
            <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-2">
              Tool Categories
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleExploreAll(cat.id as ToolCategory)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left truncate transition-all cursor-pointer ${
                    activeCategory === cat.id && currentView === 'workspace'
                      ? 'neu-pressed text-[#6C63FF]'
                      : 'neu-convex-xs text-[#475569] dark:text-slate-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main View Container */}
      {currentView === 'landing' && !selectedTool ? (
        // Dedicated Neumorphic Landing Page with Multi-Marketplace Hub
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <LandingPage
            tools={TOOLS_DATA}
            favorites={favorites}
            onSelectTool={handleSelectTool}
            onExploreAll={handleExploreAll}
            onSelectSkill={(skill) => setSelectedSkill(skill)}
            onSelectDesign={(design) => setSelectedDesign(design)}
            onSelectMcp={(mcp) => setSelectedMcp(mcp)}
            onToggleFavorite={handleToggleFavorite}
            onOpenAuth={(tab) => {
              setAuthInitialTab(tab);
              setAuthModalOpen(true);
            }}
          />
        </main>
      ) : (
        // Workspace View (Tactile Sidebar + Tools Grid / Interactive Viewer)
        <div className="flex flex-1 overflow-hidden">
          {/* Neumorphic Sidebar Navigation */}
          <aside className="w-[260px] p-6 hidden md:flex flex-col gap-2 shrink-0 overflow-y-auto">
            <button
              type="button"
              onClick={handleGoToLanding}
              className="neu-convex-sm p-3 rounded-2xl flex items-center gap-3 text-xs font-bold text-[#475569] dark:text-slate-300 hover:text-[#6C63FF] dark:hover:text-[#8B84FF] transition-colors mb-4 cursor-pointer"
            >
              <Home className="w-4 h-4 text-[#6C63FF]" />
              <span>Back to Marketplace</span>
            </button>

            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider px-3 mb-1">
              Tool Disciplines
            </div>

            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id && !showFavoritesOnly && currentView === 'workspace';
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id as any);
                    setShowFavoritesOnly(false);
                    setCurrentView('workspace');
                    if (selectedTool) setSelectedTool(null);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'neu-pressed text-[#6C63FF] dark:text-[#8B84FF]'
                      : 'neu-convex-xs text-[#475569] dark:text-slate-300 hover:text-[#1E293B] dark:hover:text-white'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isActive ? 'bg-[#6C63FF] shadow-[0_0_6px_#6C63FF]' : 'bg-[#94a3b8]'
                    }`}
                  />
                  <span className="truncate">{cat.name}</span>
                  {cat.id === 'ai' && (
                    <span className="ml-auto px-2 py-0.5 rounded-full text-[9px] font-bold neu-convex-xs text-[#6C63FF]">
                      AI
                    </span>
                  )}
                </button>
              );
            })}

            {/* Tactile System Status Well */}
            <div className="mt-auto p-4 rounded-2xl neu-pressed-deep">
              <div className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1.5">
                Ecosystem Health
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#38B2AC]">
                <div className="w-2 h-2 rounded-full bg-[#38B2AC] shadow-[0_0_8px_#38B2AC] animate-pulse" />
                <span>Zero Latency Active</span>
              </div>
              <div className="text-[10px] text-[#64748B] mt-1">
                {TOOLS_DATA.length} Tools &middot; {SKILLS_DATA.length} Skills &middot; {MCP_DATA.length} MCPs
              </div>
            </div>
          </aside>

          {/* Main Workspace Stage */}
          <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
            {selectedTool ? (
              // Active Tool View Screen
              <div className="max-w-6xl mx-auto">
                <ToolViewer
                  tool={selectedTool}
                  isFavorite={favorites.includes(selectedTool.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onBack={handleBackToDashboard}
                  onSelectTool={handleSelectTool}
                  allTools={TOOLS_DATA}
                />
              </div>
            ) : (
              // Catalog Dashboard in Neumorphic Soft UI
              <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
                {/* Catalog Header & View Toggles */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-[#cbd5e1]/40 dark:border-slate-800 gap-4">
                  <div>
                    <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#3D4852] dark:text-white">
                      {showFavoritesOnly
                        ? 'Saved Favorites'
                        : searchQuery
                        ? `Search: "${searchQuery}"`
                        : activeCategory === 'all'
                        ? 'All Utilities'
                        : `${CATEGORIES.find(c => c.id === activeCategory)?.name || 'Category'} Tools`}
                    </h1>
                    <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 mt-1">
                      {showFavoritesOnly
                        ? `Showing ${filteredTools.length} bookmarked items in your local storage.`
                        : `Showing ${filteredTools.length} high-precision utilities with physical dual-shadow feedback.`}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Grid / List Layout Switcher */}
                    <div className="p-1 rounded-2xl neu-pressed-deep flex gap-1">
                      <button
                        type="button"
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
                          viewMode === 'grid'
                            ? 'neu-convex text-[#6C63FF] shadow-xs'
                            : 'text-[#64748B] hover:text-[#1E293B]'
                        }`}
                        title="Grid Layout"
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
                          viewMode === 'list'
                            ? 'neu-convex text-[#6C63FF] shadow-xs'
                            : 'text-[#64748B] hover:text-[#1E293B]'
                        }`}
                        title="List Layout"
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Access Favorites Bar (when not filtering by favorites) */}
                {!showFavoritesOnly && favoriteTools.length > 0 && !searchQuery && activeCategory === 'all' && (
                  <div className="p-6 rounded-[32px] neu-flat space-y-4">
                    <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <h2 className="text-[#1E293B] dark:text-white font-display text-sm">
                        Quick Access Favorites
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {favoriteTools.map(tool => (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => handleSelectTool(tool)}
                          className="p-3.5 neu-convex-sm neu-convex-hover rounded-2xl text-left transition-all flex items-center gap-3 group cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-xl neu-pressed-deep text-[#6C63FF] flex items-center justify-center shrink-0">
                            <DynamicIcon name={tool.icon} className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold text-[#1E293B] dark:text-white truncate group-hover:text-[#6C63FF]">
                            {tool.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No results message */}
                {filteredTools.length === 0 && (
                  <div className="p-12 text-center neu-flat rounded-[32px] space-y-4">
                    <div className="w-16 h-16 rounded-full neu-pressed-deep flex items-center justify-center mx-auto text-[#64748B]">
                      <SlidersHorizontal className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#1E293B] dark:text-white">
                      No utilities found matching criteria
                    </h3>
                    <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                      Try searching with another keyword or resetting your filter.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('all');
                        setShowFavoritesOnly(false);
                      }}
                      className="neu-btn-accent px-6 py-2.5 rounded-2xl text-xs font-bold cursor-pointer inline-flex items-center gap-2"
                    >
                      Reset Filter
                    </button>
                  </div>
                )}

                {/* Neumorphic Tool Grid */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                    {filteredTools.map(tool => {
                      const isFav = favorites.includes(tool.id);

                      return (
                        <div
                          key={tool.id}
                          onClick={() => handleSelectTool(tool)}
                          className="neu-flat neu-convex-hover rounded-[32px] p-6 flex flex-col items-center text-center cursor-pointer group relative"
                        >
                          {/* Top action: Favorite & Badge */}
                          <div className="w-full flex items-center justify-between absolute top-4 px-4">
                            {tool.badge ? (
                              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full neu-convex-xs text-[#6C63FF]">
                                {tool.badge}
                              </span>
                            ) : (
                              <div />
                            )}

                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                handleToggleFavorite(tool.id);
                              }}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                isFav
                                  ? 'neu-pressed text-amber-500'
                                  : 'neu-convex-xs text-[#6B7280] hover:text-amber-400'
                              }`}
                              title={isFav ? 'Remove Favorite' : 'Save Favorite'}
                            >
                              <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                            </button>
                          </div>

                          {/* Sculpted Inset Deep Icon Well */}
                          <div className="w-14 h-14 rounded-2xl neu-pressed-deep flex items-center justify-center text-[#6C63FF] mt-2 mb-4 group-hover:scale-105 transition-transform shrink-0">
                            <DynamicIcon name={tool.icon} className="w-6 h-6" />
                          </div>

                          {/* Card Title & Desc */}
                          <h3 className="font-display font-bold text-sm text-[#3D4852] dark:text-white group-hover:text-[#6C63FF] transition-colors mb-1">
                            {tool.name}
                          </h3>
                          <p className="text-xs text-[#6B7280] dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Compact Neumorphic List View */
                  <div className="space-y-4">
                    {filteredTools.map(tool => {
                      const isFav = favorites.includes(tool.id);

                      return (
                        <div
                          key={tool.id}
                          onClick={() => handleSelectTool(tool)}
                          className="neu-flat neu-convex-hover rounded-2xl p-4 flex items-center justify-between cursor-pointer group gap-4"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-10 h-10 rounded-xl neu-pressed-deep flex items-center justify-center text-[#6C63FF] shrink-0 font-bold text-sm">
                              <DynamicIcon name={tool.icon} className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-display font-bold text-sm text-[#3D4852] dark:text-white group-hover:text-[#6C63FF] truncate">
                                  {tool.name}
                                </h3>
                                {tool.badge && (
                                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full neu-convex-xs text-[#6C63FF]">
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#6B7280] dark:text-slate-400 truncate">
                                {tool.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                handleToggleFavorite(tool.id);
                              }}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                isFav ? 'neu-pressed text-amber-500' : 'neu-convex-xs text-[#6B7280] hover:text-amber-400'
                              }`}
                            >
                              <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                            </button>
                            <div className="w-8 h-8 rounded-full neu-convex-xs flex items-center justify-center text-[#6B7280] group-hover:text-[#6C63FF]">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      )}

      {/* Neumorphic Footer */}
      <footer className="h-12 neu-flat flex items-center justify-between px-6 sm:px-8 text-xs text-[#6B7280] shrink-0 font-medium z-10">
        <div className="flex items-center gap-4">
          <span className="font-display font-bold text-[#3D4852] dark:text-slate-300">DMLab Ecosystem</span>
          <span className="hidden sm:inline">&middot;</span>
          <button
            type="button"
            onClick={handleGoToLanding}
            className="hover:text-[#6C63FF] cursor-pointer hidden sm:inline"
          >
            Marketplace
          </button>
          <span className="hidden sm:inline">&middot;</span>
          <button
            type="button"
            onClick={() => handleExploreAll('all')}
            className="hover:text-[#6C63FF] cursor-pointer hidden sm:inline"
          >
            Tools Suite
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#38B2AC] shadow-[0_0_6px_#38B2AC]" />
            <span>AI Skills &middot; Design Tokens &middot; MCP Servers &middot; Tools</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
