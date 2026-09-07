export type ToolCategory =
  | 'all'
  | 'text'
  | 'image'
  | 'css'
  | 'coding'
  | 'color'
  | 'social'
  | 'misc'
  | 'ai'
  | 'network';

export type MarketplaceTab = 'all' | 'tools' | 'skills' | 'design' | 'mcp';

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  icon: string;
  colorClass: string;
  borderClass: string;
  bgLightClass: string;
}

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  category: Exclude<ToolCategory, 'all'>;
  icon: string;
  tags: string[];
  badge?: 'Popular' | 'New' | 'Featured' | 'AI' | 'Audio' | 'Live' | string;
  keywords: string[];
}

export interface RecentTool {
  id: string;
  timestamp: number;
}

// --- AI AGENT SKILLS MARKETPLACE TYPES ---
export type SkillCategory = 'database' | 'ai-core' | 'automation' | 'devtools' | 'security' | 'integration' | 'design' | 'testing';

export interface AgentSkillItem {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: SkillCategory;
  version: string;
  author: string;
  stars?: number;
  badge?: string;
  compatibleWith: ('Claude Code' | 'Gemini / AI Studio' | 'Cursor' | 'Antigravity' | 'AutoGPT' | 'LangChain' | 'Windsurf')[];
  triggers: string[];
  requiredTools: string[];
  yamlFrontmatter: string;
  rawMarkdown: string;
  quickSetupInstructions: string;
  tags: string[];
}

// --- DESIGN SYSTEM (DESIGN.MD) MARKETPLACE TYPES ---
export type DesignArchetype = 'tactile-neumorphism' | 'swiss-minimalism' | 'dark-luxury' | 'bento-editorial' | 'high-contrast-saas' | 'cyberpunk-hud';

export interface DesignSystemItem {
  id: string;
  name: string;
  slug: string;
  archetype: DesignArchetype;
  tagline: string;
  description: string;
  author: string;
  badge?: string;
  primaryColor: string;
  accentColor: string;
  bgTone: string;
  contrastRatio: string;
  typographyHeading: string;
  typographyBody: string;
  mathScale: string;
  cornerRadii: { sm: string; md: string; lg: string; pill: string };
  antiSlopRules: string[];
  rawMarkdown: string;
  tailwindTokens: string;
  cssVariables: string;
  tags: string[];
}

// --- MCP (MODEL CONTEXT PROTOCOL) MARKETPLACE TYPES ---
export type McpCategory = 'database' | 'filesystem' | 'cloud' | 'devtools' | 'web-scraping' | 'search' | 'communication' | 'ai-memory';

export interface McpToolCapability {
  name: string;
  description: string;
  parameters: { [param: string]: string };
}

export interface McpServerItem {
  id: string;
  name: string;
  slug: string;
  vendor: string;
  tagline: string;
  description: string;
  category: McpCategory;
  badge?: string;
  transport: 'stdio' | 'sse' | 'http';
  githubUrl?: string;
  npmPackage?: string;
  dockerImage?: string;
  pypiPackage?: string;
  envVars: { name: string; required: boolean; description: string; placeholder: string }[];
  clientConfigSample: {
    claudeDesktop: object;
    cursorConfig?: object;
  };
  cliCommand: string;
  toolsProvided: McpToolCapability[];
  setupGuideMarkdown: string;
  tags: string[];
}

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';
export type PlanTier = 'free' | 'pro' | 'enterprise';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  plan: PlanTier;
  activeWorkspaceId?: string;
  favoriteTools: string[];
  favoriteSkills?: string[];
  favoriteDesigns?: string[];
  favoriteMcps?: string[];
  createdAt: string;
  lastLoginAt: string;
}

export interface WorkspaceMember {
  userId: string;
  email: string;
  role: UserRole;
  joinedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  plan: PlanTier;
  createdAt: string;
  members: WorkspaceMember[];
}

export interface SharedSnippet {
  id: string;
  workspaceId: string;
  userId: string;
  userEmail: string;
  toolId: string;
  toolName: string;
  title: string;
  content: string;
  type?: 'tool' | 'skill' | 'design' | 'mcp';
  tags?: string[];
  isPublic?: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  workspaceId: string;
  userId: string;
  userEmail: string;
  action: string;
  details: string;
  createdAt: string;
}

