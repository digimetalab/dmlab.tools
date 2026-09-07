import { AgentSkillItem } from '../types';

export const SKILLS_DATA: AgentSkillItem[] = [
  {
    id: 'skill-firebase-firestore',
    name: 'Firebase Firestore & Auth Integration',
    slug: 'firebase-firestore-auth',
    tagline: 'Production zero-trust ABAC security rules, relational invariants, and Firestore SDK hooks',
    description: 'Comprehensive setup for Firebase Firestore and Authentication. Generates secure firestore.rules with Master Gate relational validation, Anti-Update-Gap assertions, and TypeScript error handlers.',
    category: 'database',
    version: '2.4.0',
    author: 'DMLab AI Core',
    stars: 1240,
    badge: 'Popular',
    compatibleWith: ['Gemini / AI Studio', 'Claude Code', 'Cursor', 'Antigravity'],
    triggers: [
      'Database / Firestore persistence requested',
      'User Authentication or multi-tenant RBAC',
      'Security rules generation or audit',
      'Shared data collections across users',
    ],
    requiredTools: ['set_up_firebase', 'deploy_firebase', 'view_file', 'edit_file'],
    yamlFrontmatter: `---
name: "firebase-integration"
description: |
  Integrates Firebase (Firestore and Auth) into applications, generates zero-trust security rules, and handles permission errors.
version: "2.4.0"
category: "database"
---`,
    rawMarkdown: `# Firebase Integration Skill

The Firebase Integration Skill enables agents to seamlessly incorporate Firestore and Authentication with mathematical security.

## Core Directives
1. **Zero-Trust ABAC Security Rules**: Never write open wildcard rules. Always enforce \`isValid[Entity]()\` helper functions on both create and update.
2. **The Master Gate Pattern**: For sub-collections, always verify membership in the parent entity via relational checks.
3. **Strict Keys Constraint**: Use exact key size matching on create and \`affectedKeys().hasOnly()\` during update actions.
4. **Error Context Standardization**: Throw JSON-structured \`FirestoreErrorInfo\` errors on permission denial for automated self-healing.

## Setup Code Template
\`\`\`ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
\`\`\`
`,
    quickSetupInstructions: 'Place in `/skills/firebase-integration/SKILL.md` or import directly into your agent instructions context.',
    tags: ['Firebase', 'Firestore', 'Auth', 'ABAC Security', 'RBAC', 'Database'],
  },
  {
    id: 'skill-gemini-interactions',
    name: 'Gemini SDK & Live Interactions API',
    slug: 'gemini-interactions-api',
    tagline: 'Modern @google/genai TypeScript SDK patterns with streaming, tools, and multi-modal models',
    description: 'Guidelines and verified code templates for the official @google/genai TypeScript SDK. Includes server-side proxying, streaming generation, multimodal image/audio analysis, and tool function calling.',
    category: 'ai-core',
    version: '3.1.0',
    author: 'Google AI Studio Lab',
    stars: 1890,
    badge: 'Featured',
    compatibleWith: ['Gemini / AI Studio', 'Cursor', 'Antigravity', 'Claude Code'],
    triggers: [
      'Gemini AI API calls',
      'Multi-modal LLM reasoning or prompt streaming',
      'Function calling & tools execution',
      'Image or audio transcription/synthesis',
    ],
    requiredTools: ['view_file', 'edit_file', 'install_applet_package'],
    yamlFrontmatter: `---
name: "gemini-api"
description: |
  Provides model selection guidance and verified patterns for @google/genai TypeScript SDK.
version: "3.1.0"
category: "ai-core"
---`,
    rawMarkdown: `# Gemini API & SDK Integration Skill

Official architectural patterns for integrating Gemini 2.5 and 2.0 Flash / Pro models via the modern \`@google/genai\` SDK.

## Key Rules
1. **Server-Side Proxying**: Never expose \`GEMINI_API_KEY\` to browser clients. Proxy all calls via backend \`/api/gemini\` endpoints.
2. **SDK Import**: Always import \`{ GoogleGenAI }\` from \`@google/genai\`. Do not use deprecated legacy packages.
3. **Structured Outputs**: Use \`responseSchema\` with \`Type.OBJECT\` when returning machine-parsable JSON.

\`\`\`ts
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: 'Generate structured API response',
});
console.log(response.text);
\`\`\`
`,
    quickSetupInstructions: 'Add `@google/genai` to dependencies and load `SKILL.md` into agent workspace.',
    tags: ['Gemini', 'LLM', 'AI', 'Google GenAI', 'Multi-modal', 'Streaming'],
  },
  {
    id: 'skill-anti-slop-design',
    name: 'Anti-Slop UI & Tactile Craftsmanship',
    slug: 'anti-slop-design-system',
    tagline: 'Strict mathematical layout rules, optical spacing, and rejection of generic AI clichés',
    description: 'An opinionated design specification skill that enforces mathematical padding ratios, nested corner radius formulas, high-contrast typography pairings, and bans generic purple-glow AI slop.',
    category: 'design',
    version: '2.0.0',
    author: 'Tactile Studio',
    stars: 2150,
    badge: 'Popular',
    compatibleWith: ['Cursor', 'Claude Code', 'Gemini / AI Studio', 'Windsurf', 'Antigravity'],
    triggers: [
      'Frontend UI design or redesign',
      'Layout polishing and styling review',
      'Color palette and typography selection',
      'Rejecting generic AI-generated templates',
    ],
    requiredTools: ['view_file', 'edit_file'],
    yamlFrontmatter: `---
name: "anti-slop-design"
description: |
  Enforces mathematical layout rigor, optical hierarchy, and deliberate craft in UI code.
version: "2.0.0"
category: "design"
---`,
    rawMarkdown: `# Anti-Slop Tactile Design Skill

Eliminates AI clichés and delivers mathematically sound user interfaces.

## Banned Patterns
- ❌ No purple-to-blue generic neon gradients
- ❌ No arbitrary dark-mode cyan glows
- ❌ No cards inside cards (nested boxes without hierarchy)
- ❌ No single-side thick border accents competing with rounded corners

## Mathematical Rules
1. **Nested Radius Formula**: \`R_inner = R_outer - Padding\`
2. **Outer Padding Invariant**: Container outer padding must always be >= inner gap spacing.
3. **Button Symmetry**: Horizontal padding must be exactly 2x vertical padding (e.g., \`px-4 py-2\`).
4. **Neutral Depth**: Add <5% HSB saturation to grays for subtle warm or cool tactile richness.
`,
    quickSetupInstructions: 'Incorporate into your `AGENTS.md` or system instructions to enforce clean aesthetic boundaries.',
    tags: ['Design System', 'Anti-Slop', 'Neumorphism', 'Typography', 'Tactile UI'],
  },
  {
    id: 'skill-mcp-agent-orchestrator',
    name: 'MCP Client & Server Tool Orchestrator',
    slug: 'mcp-agent-orchestrator',
    tagline: 'Standardized Model Context Protocol client setup, tool discovery, and stdio execution',
    description: 'Protocol-level instructions for AI agents to connect to MCP (Model Context Protocol) servers, discover resources and tools, manage sessions over STDIO/SSE, and parse structured output safely.',
    category: 'integration',
    version: '1.5.0',
    author: 'Anthropic MCP Working Group',
    stars: 1620,
    badge: 'New',
    compatibleWith: ['Claude Code', 'Cursor', 'Windsurf', 'AutoGPT', 'LangChain'],
    triggers: [
      'Connecting to MCP servers',
      'Model Context Protocol integration',
      'Filesystem or Postgres tool calling over MCP',
      'Claude Desktop configuration generation',
    ],
    requiredTools: ['run_command', 'edit_file', 'view_file'],
    yamlFrontmatter: `---
name: "mcp-orchestration"
description: |
  Connects agents to Model Context Protocol (MCP) servers with automatic schema parsing.
version: "1.5.0"
category: "integration"
---`,
    rawMarkdown: `# Model Context Protocol (MCP) Integration Skill

Connects local AI agents with external databases, file trees, search APIs, and developer toolchains using the open MCP standard.

## Client Configuration Spec (\`claude_desktop_config.json\`)
\`\`\`json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/directory"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
    }
  }
}
\`\`\`
`,
    quickSetupInstructions: 'Save config inside your client MCP directory (`~/.claude/claude_desktop_config.json`).',
    tags: ['MCP', 'Protocol', 'Tool Calling', 'Claude', 'Agent Tools'],
  },
  {
    id: 'skill-cloudsql-drizzle',
    name: 'Cloud SQL & Drizzle ORM Setup',
    slug: 'cloudsql-drizzle-orm',
    tagline: 'Instant PostgreSQL relational schema, Drizzle type safety, and zero-downtime migrations',
    description: 'Complete skill for provisioning PostgreSQL on Cloud SQL, configuring Drizzle ORM with TypeScript schemas, running migrations, and establishing connection pools with SSL enforcement.',
    category: 'database',
    version: '1.8.2',
    author: 'Cloud Data Guild',
    stars: 980,
    compatibleWith: ['Gemini / AI Studio', 'Cursor', 'Claude Code'],
    triggers: [
      'PostgreSQL or SQL relational database requested',
      'Drizzle ORM schema updates or migrations',
      'Cloud SQL instance connection',
    ],
    requiredTools: ['view_file', 'edit_file', 'run_command'],
    yamlFrontmatter: `---
name: "cloudsql-drizzle"
description: |
  PostgreSQL database provisioning and type-safe Drizzle ORM schema management.
version: "1.8.2"
category: "database"
---`,
    rawMarkdown: `# Cloud SQL & Drizzle ORM Skill

Guides the configuration of PostgreSQL schemas and Drizzle ORM queries.

\`\`\`ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  displayName: text('display_name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
\`\`\`
`,
    quickSetupInstructions: 'Define schema in `src/db/schema.ts` and run drizzle push.',
    tags: ['PostgreSQL', 'Drizzle ORM', 'SQL', 'Cloud SQL', 'Relational'],
  },
  {
    id: 'skill-playwright-e2e',
    name: 'End-to-End Testing with Playwright',
    slug: 'playwright-e2e-testing',
    tagline: 'Resilient browser automation, visual regression testing, and accessibility assertions',
    description: 'Skill for writing robust Playwright automated integration tests with auto-waiting selectors, accessible ARIA roles, network mocks, and screenshot diffing.',
    category: 'testing',
    version: '2.1.0',
    author: 'QA Automation Lead',
    stars: 890,
    compatibleWith: ['Claude Code', 'Cursor', 'Windsurf', 'Antigravity'],
    triggers: [
      'Writing E2E tests',
      'Browser automated test setup',
      'Accessibility audit assertions',
    ],
    requiredTools: ['run_command', 'view_file', 'edit_file'],
    yamlFrontmatter: `---
name: "playwright-testing"
description: |
  Robust browser automation testing with resilient locator strategies.
version: "2.1.0"
category: "testing"
---`,
    rawMarkdown: `# Playwright E2E Skill

Best practices for writing maintainable browser tests:
1. Always prefer role-based locators (\`page.getByRole('button', { name: 'Submit' })\`).
2. Avoid fixed \`sleep\` timeouts; rely on web-first assertions.
3. Isolate tests with clean browser contexts.
`,
    quickSetupInstructions: 'Install `@playwright/test` and run `npx playwright test`.',
    tags: ['Playwright', 'Testing', 'E2E', 'Automation', 'QA'],
  },
];
