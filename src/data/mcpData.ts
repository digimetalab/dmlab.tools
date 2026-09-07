import { McpServerItem } from '../types';

export const MCP_DATA: McpServerItem[] = [
  {
    id: 'mcp-server-filesystem',
    name: 'Filesystem MCP Server',
    slug: 'filesystem-mcp',
    vendor: 'Model Context Protocol Official',
    tagline: 'Secure direct read, write, directory listing, and file search within allowed directories',
    description: 'Enables Claude, Cursor, and other MCP clients to inspect, search, create, and modify project files securely within sandboxed allowed directories.',
    category: 'filesystem',
    badge: 'Official',
    transport: 'stdio',
    githubUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
    npmPackage: '@modelcontextprotocol/server-filesystem',
    cliCommand: 'npx -y @modelcontextprotocol/server-filesystem /path/to/project',
    envVars: [],
    clientConfigSample: {
      claudeDesktop: {
        mcpServers: {
          filesystem: {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-filesystem', '/Users/username/Projects'],
          },
        },
      },
      cursorConfig: {
        filesystem: {
          command: 'npx -y @modelcontextprotocol/server-filesystem .',
        },
      },
    },
    toolsProvided: [
      { name: 'read_file', description: 'Read full or partial contents of a file', parameters: { path: 'string' } },
      { name: 'write_file', description: 'Write or overwrite file contents', parameters: { path: 'string', content: 'string' } },
      { name: 'list_directory', description: 'List files and subdirectories in a directory', parameters: { path: 'string' } },
      { name: 'search_files', description: 'Search for files matching regex or glob patterns', parameters: { path: 'string', pattern: 'string' } },
    ],
    setupGuideMarkdown: `# Filesystem MCP Server Setup

Add this configuration to your \`claude_desktop_config.json\` or IDE MCP settings:

\`\`\`json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/your/allowed/directory"
      ]
    }
  }
}
\`\`\`
`,
    tags: ['Filesystem', 'I/O', 'Official', 'File Search', 'Read/Write'],
  },
  {
    id: 'mcp-server-postgres',
    name: 'PostgreSQL MCP Server',
    slug: 'postgres-mcp',
    vendor: 'Model Context Protocol Official',
    tagline: 'Read schemas, inspect tables, execute read-only queries, and analyze SQL data',
    description: 'Provides read-only database query execution, table inspection, schema analysis, and relational data exploration directly to your AI agent.',
    category: 'database',
    badge: 'Popular',
    transport: 'stdio',
    githubUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/postgres',
    npmPackage: '@modelcontextprotocol/server-postgres',
    cliCommand: 'npx -y @modelcontextprotocol/server-postgres postgresql://localhost/mydb',
    envVars: [
      { name: 'DATABASE_URL', required: true, description: 'PostgreSQL Connection URI string', placeholder: 'postgresql://user:pass@localhost:5432/dbname' },
    ],
    clientConfigSample: {
      claudeDesktop: {
        mcpServers: {
          postgres: {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-postgres', 'postgresql://user:password@localhost:5432/dbname'],
          },
        },
      },
    },
    toolsProvided: [
      { name: 'query', description: 'Execute read-only SQL query against database', parameters: { sql: 'string' } },
      { name: 'list_tables', description: 'List all public schema tables', parameters: {} },
      { name: 'describe_table', description: 'Describe column types, keys, and foreign constraints', parameters: { table_name: 'string' } },
    ],
    setupGuideMarkdown: `# PostgreSQL MCP Server Setup

Connect your PostgreSQL database securely over local STDIO:

\`\`\`json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://user:password@localhost:5432/dbname"
      ]
    }
  }
}
\`\`\`
`,
    tags: ['Postgres', 'SQL', 'Database', 'Schema Inspection', 'Relational'],
  },
  {
    id: 'mcp-server-github',
    name: 'GitHub MCP Server',
    slug: 'github-mcp',
    vendor: 'Model Context Protocol Official',
    tagline: 'Manage repos, issues, pull requests, commits, and code searches via GitHub API',
    description: 'Enables AI agents to search code across repositories, create and review pull requests, triage issues, and inspect repository commits using a GitHub Personal Access Token.',
    category: 'devtools',
    badge: 'Official',
    transport: 'stdio',
    githubUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github',
    npmPackage: '@modelcontextprotocol/server-github',
    cliCommand: 'npx -y @modelcontextprotocol/server-github',
    envVars: [
      { name: 'GITHUB_PERSONAL_ACCESS_TOKEN', required: true, description: 'GitHub PAT with repo & workflow scopes', placeholder: 'ghp_xxxxxxxxxxxx' },
    ],
    clientConfigSample: {
      claudeDesktop: {
        mcpServers: {
          github: {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-github'],
            env: {
              GITHUB_PERSONAL_ACCESS_TOKEN: 'YOUR_GITHUB_TOKEN',
            },
          },
        },
      },
    },
    toolsProvided: [
      { name: 'search_repositories', description: 'Search GitHub repositories by keyword', parameters: { query: 'string' } },
      { name: 'create_issue', description: 'Create a new GitHub issue', parameters: { owner: 'string', repo: 'string', title: 'string', body: 'string' } },
      { name: 'create_pull_request', description: 'Create a pull request', parameters: { owner: 'string', repo: 'string', head: 'string', base: 'string' } },
      { name: 'get_file_contents', description: 'Fetch file content from a repository branch', parameters: { owner: 'string', repo: 'string', path: 'string' } },
    ],
    setupGuideMarkdown: `# GitHub MCP Server Setup

1. Create a GitHub Personal Access Token with \`repo\` scope.
2. Add to \`claude_desktop_config.json\`:

\`\`\`json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
      }
    }
  }
}
\`\`\`
`,
    tags: ['GitHub', 'Git', 'Pull Requests', 'Issues', 'Code Search', 'DevTools'],
  },
  {
    id: 'mcp-server-brave-search',
    name: 'Brave Search MCP Server',
    slug: 'brave-search-mcp',
    vendor: 'Model Context Protocol Official',
    tagline: 'Real-time privacy-first web search and local queries for live agent grounding',
    description: 'Empowers AI assistants with live web search results and query expansion using the Brave Search API with no user tracking.',
    category: 'search',
    badge: 'Popular',
    transport: 'stdio',
    githubUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search',
    npmPackage: '@modelcontextprotocol/server-brave-search',
    cliCommand: 'npx -y @modelcontextprotocol/server-brave-search',
    envVars: [
      { name: 'BRAVE_API_KEY', required: true, description: 'Brave Search API Key from api.search.brave.com', placeholder: 'BSAx...' },
    ],
    clientConfigSample: {
      claudeDesktop: {
        mcpServers: {
          'brave-search': {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-brave-search'],
            env: {
              BRAVE_API_KEY: 'YOUR_BRAVE_KEY',
            },
          },
        },
      },
    },
    toolsProvided: [
      { name: 'brave_web_search', description: 'Search web with keyword query', parameters: { query: 'string', count: 'number' } },
      { name: 'brave_local_search', description: 'Search local places and businesses', parameters: { query: 'string' } },
    ],
    setupGuideMarkdown: `# Brave Search MCP Setup

\`\`\`json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "YOUR_BRAVE_KEY"
      }
    }
  }
}
\`\`\`
`,
    tags: ['Search', 'Brave Search', 'Grounding', 'Web Search', 'Real-time'],
  },
  {
    id: 'mcp-server-memory',
    name: 'Graph Memory MCP Server',
    slug: 'memory-mcp',
    vendor: 'Model Context Protocol Official',
    tagline: 'Persistent knowledge graph memory across agent chat sessions and projects',
    description: 'Maintains an associative entity-relationship knowledge graph so AI assistants remember concepts, user preferences, and architecture decisions across separate sessions.',
    category: 'ai-memory',
    badge: 'New',
    transport: 'stdio',
    githubUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/memory',
    npmPackage: '@modelcontextprotocol/server-memory',
    cliCommand: 'npx -y @modelcontextprotocol/server-memory',
    envVars: [],
    clientConfigSample: {
      claudeDesktop: {
        mcpServers: {
          memory: {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-memory'],
          },
        },
      },
    },
    toolsProvided: [
      { name: 'create_entities', description: 'Save new concepts or entities into graph memory', parameters: { entities: 'array' } },
      { name: 'create_relations', description: 'Create connections between existing entities', parameters: { relations: 'array' } },
      { name: 'read_graph', description: 'Read the full knowledge memory graph', parameters: {} },
      { name: 'search_nodes', description: 'Search memory graph for relevant nodes', parameters: { query: 'string' } },
    ],
    setupGuideMarkdown: `# Memory MCP Server Setup

\`\`\`json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
\`\`\`
`,
    tags: ['Memory', 'Knowledge Graph', 'State Persistence', 'Context', 'AI Memory'],
  },
  {
    id: 'mcp-server-puppeteer',
    name: 'Puppeteer Headless Browser MCP',
    slug: 'puppeteer-mcp',
    vendor: 'Model Context Protocol Official',
    tagline: 'Automated headless Chrome navigation, screenshots, DOM interaction, and web scraping',
    description: 'Allows AI agents to navigate web pages, click elements, fill forms, execute client JavaScript, and capture viewport screenshots.',
    category: 'web-scraping',
    transport: 'stdio',
    githubUrl: 'https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer',
    npmPackage: '@modelcontextprotocol/server-puppeteer',
    cliCommand: 'npx -y @modelcontextprotocol/server-puppeteer',
    envVars: [],
    clientConfigSample: {
      claudeDesktop: {
        mcpServers: {
          puppeteer: {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-puppeteer'],
          },
        },
      },
    },
    toolsProvided: [
      { name: 'navigate', description: 'Navigate to target URL', parameters: { url: 'string' } },
      { name: 'screenshot', description: 'Capture screenshot of current viewport', parameters: { name: 'string' } },
      { name: 'click', description: 'Click CSS selector element', parameters: { selector: 'string' } },
      { name: 'evaluate', description: 'Execute JavaScript code in browser context', parameters: { script: 'string' } },
    ],
    setupGuideMarkdown: `# Puppeteer MCP Server Setup

\`\`\`json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
\`\`\`
`,
    tags: ['Puppeteer', 'Headless Browser', 'Screenshots', 'Scraping', 'Automation'],
  },
];
