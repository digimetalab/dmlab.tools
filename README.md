# DMLab Tools — All-in-One Developer & Designer Toolbox

**DMLab Tools** is a modern, all-in-one digital toolbox platform engineered for software engineers, UI/UX designers, system administrators, and digital creators. Built with a tactile neumorphic soft UI, real-time visual previews, and a scalable dual-mode database engine (local SQLite & Turso Cloud).

---

## 🚀 Features & Tool Categories

### 1. 🔤 Text & Writing Tools
- **Case Converter**: Convert text to UPPERCASE, lowercase, camelCase, kebab-case, snake_case, PascalCase, Title Case, and more.
- **Word & Character Counter**: Comprehensive metrics for word count, characters, sentences, paragraphs, reading time, and word density.
- **Slug Generator**: Generate clean, SEO-friendly URL slugs from any headline or text.
- **Lorem Ipsum Generator**: Generate placeholder dummy text in paragraphs, sentences, or lists.
- **Text Sorter & Deduplicator**: Alphabetical line sorting, duplicate line removal, and order reversal.
- **Diff / Text Compare**: Side-by-side and inline difference comparison between two text blocks.
- **ASCII Art Generator**: Convert standard text into stylized ASCII art banners.

### 2. 🎨 CSS & UI Generators
- **Neumorphism Generator**: Design soft UI shadows (flat, convex, concave, pressed) with instant CSS export.
- **Glassmorphism Generator**: Frosted glass effects with backdrop blur and transparency controls.
- **Box Shadow & Glow Generator**: Multi-layer box shadow configuration with spread, blur, and inset settings.
- **Border Radius & Shape**: Visual interactive editor for irregular border-radius curvature.
- **CSS Gradient Generator**: Create linear and radial gradients with customizable color stops.
- **Flexbox Playground**: Interactive simulator for Flexbox layout properties (direction, justify, align, wrap, gap).
- **CSS Grid Layout Generator**: Responsive CSS grid generator with custom track, row, and gap controls.
- **CSS Animation & Cubic Bezier**: Custom transition easing curves and keyframe animation builder.

### 3. 🌐 Network & Connectivity Tools
- **WHOIS & RDAP Lookup**: Inspect domain registrar details, registration/expiration dates, DNSSEC, and authoritative nameservers.
- **DNS Records Resolver**: Real-time DNS query resolver supporting A, AAAA, MX, TXT, NS, CNAME, SOA, and CAA records.
- **Ping & Latency Tester**: Measures round-trip time (RTT), jitter, and packet loss.
- **IP & Subnet CIDR Calculator**: Calculate subnet masks, usable host ranges, broadcast addresses, and binary notations.
- **My Public IP & Geolocation**: Inspect client public IP address, ISP, location coordinates, and timezone.
- **HTTP Header & Status Inspector**: Response header audit tool and comprehensive HTTP status code reference (1xx–5xx).
- **SSL/TLS Certificate Checker**: Inspect SSL certificate validity, issuer authority, TLS protocols, and SANs.
- **MAC Address Vendor & Formatter**: Hardware OUI lookup (Apple, Cisco, Intel, etc.) and MAC notation formatter.
- **Port Reference & Protocol Guide**: Searchable database of 120+ standard TCP/UDP service ports.
- **User-Agent & Device Parser**: Browser engine, operating system, and bot detection parser.
- **URL & Query Parameter Analyzer**: Deconstruct and edit query string parameters interactively.
- **Bandwidth & Download Calculator**: Transfer duration estimation based on payload size and network bandwidth.

### 4. 💻 Coding & Web Utilities
- **JSON Formatter & Validator**: Format, minify, repair syntax errors, and validate JSON payloads.
- **Base64 Encoder / Decoder**: Encode and decode text strings and binary files to Base64 format.
- **JWT Debugger & Decoder**: Deconstruct headers, claims payload, and verify JSON Web Token signatures.
- **Regex Tester & Explainer**: Test regular expressions with interactive match highlighting and regex flags (g, i, m).
- **HTML / URL Encoder & Decoder**: Encode and decode special characters for web safety.
- **Hash Generator**: Cryptographic hash generator for MD5, SHA-1, SHA-256, and SHA-512 algorithms.
- **Markdown Live Editor**: Split-pane markdown editor with synchronous live HTML rendering.

### 5. 🎨 Color & Palette Tools
- **Color Converter & Picker**: Synchronous conversion between HEX, RGB, HSL, HSV, and CMYK formats.
- **Color Contrast Checker**: WCAG AA & AAA accessibility contrast ratio evaluation.
- **Tailwind CSS Color Helper**: Map custom hex codes to nearest Tailwind CSS utility color classes.
- **Color Harmonies & Palettes**: Generate complementary, analogous, triadic, and tetradic color palettes.
- **Color Shades & Tints**: Incremental lightness and darkness variations generator.
- **Color Blender**: Multi-stop color interpolation with CSS gradient output.

### 6. 📱 Social Media & Image Tools
- **QR Code Generator**: Customizable QR code generator with color, size, error correction, and PNG/SVG export.
- **Image Cropper & Resizer**: Browser-side canvas image cropping and resolution adjustments.
- **Social Media Post Previewer**: Social share card preview simulator for Open Graph, Twitter/X, LinkedIn, and Facebook.
- **SVG Optimizer & Viewer**: Inspect, sanitize, and minify raw SVG vector markup.

### 7. 🔢 Math & Daily Calculators
- **Percentage & Growth Calculator**: Calculate percentage of values, margins, discounts, and percent changes.
- **Discount & Sales Tax Calculator**: Compute multi-tier discounts, coupon codes, and sales tax.
- **Length & Weight Unit Converter**: Metric to imperial unit conversion for length, mass, and temperature.
- **Aspect Ratio Calculator**: Dimensions calculator for standard display ratios (16:9, 4:3, 1:1, 21:9, custom).
- **Storage & Data Unit Converter**: Convert storage values between bits, bytes, KB, MB, GB, TB, and PB.
- **Timezone & Date Difference**: Calculate duration differences across dates and global timezones.

### 8. 🤖 AI-Powered Tools (Powered by Groq API)
- **AI Code Explainer & Optimizer**: Code logic walkthrough, security inspection, and performance optimization suggestions.
- **AI Regex Assistant**: Generate complex regular expressions from plain English prompts.
- **AI Text Enhancer**: Grammar correction, rewriting, and tone adjustments (formal, casual, concise).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion
- **Icons**: Lucide React
- **Backend API**: Node.js, Express, tsx
- **Build Tool**: Vite 6, esbuild
- **Database Engine**: `@libsql/client` (Dual-Mode: Local SQLite & Turso Cloud DB over HTTP)
- **Authentication**: Stateless JWT + bcrypt password hashing & Google Identity Services (OAuth 2.0)
- **AI Engine**: Groq API SDK (`groq-sdk`, default `llama-3.3-70b-versatile` or `openai/gpt-oss-120b`)

---

## 🗄️ Database Architecture & Schema

The application uses **libSQL** (`@libsql/client`), which supports both local embedded SQLite files and remote Turso Cloud databases with identical schemas and syntax.

### Database Tables Overview

| Table Name | Description | Key Relationships |
|---|---|---|
| `users` | User accounts, profiles, authentication hashes, and user preferences | Referenced by `workspaces`, `workspace_members`, `shared_snippets`, `audit_logs` |
| `workspaces` | Collaborative team workspaces and organization vaults | Belongs to `users` (owner), referenced by `workspace_members`, `shared_snippets`, `audit_logs` |
| `workspace_members` | Many-to-many relationship mapping users to workspaces with granular roles | Joins `users` and `workspaces` |
| `shared_snippets` | Tool configurations, saved code snippets, and designs shared within a workspace | Belongs to `workspaces` and `users` |
| `audit_logs` | Security, collaboration, and action audit trail for each workspace | Belongs to `workspaces` and `users` |

---

### Detailed Table Schemas

#### 1. `users`
Stores primary user identity and profile metadata.
```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,                   -- Unique user identifier (e.g., usr_abc123)
  email TEXT UNIQUE NOT NULL,            -- Lowercased, unique email address
  display_name TEXT NOT NULL,            -- Full or display name
  password_hash TEXT NOT NULL,           -- bcrypt hash or random cryptographic string
  photo_url TEXT DEFAULT '',             -- Avatar image URL (or Google profile picture)
  role TEXT NOT NULL DEFAULT 'owner'     -- Global role: 'owner', 'admin', 'member', 'viewer'
    CHECK(role IN ('owner', 'admin', 'member', 'viewer')),
  plan TEXT NOT NULL DEFAULT 'free'      -- Subscription plan: 'free', 'pro', 'enterprise'
    CHECK(plan IN ('free', 'pro', 'enterprise')),
  active_workspace_id TEXT,              -- Currently selected workspace ID
  favorite_tools TEXT NOT NULL DEFAULT '[]', -- JSON array of favorite tool IDs
  created_at TEXT NOT NULL,              -- ISO-8601 creation timestamp
  last_login_at TEXT NOT NULL            -- ISO-8601 last login timestamp
);
```

#### 2. `workspaces`
Stores workspaces created by users.
```sql
CREATE TABLE IF NOT EXISTS workspaces (
  id TEXT PRIMARY KEY,                   -- Unique workspace identifier (e.g., ws_xyz789)
  name TEXT NOT NULL,                    -- Workspace name (e.g., "Developer's Workspace")
  owner_id TEXT NOT NULL,                -- User ID of workspace owner
  plan TEXT NOT NULL DEFAULT 'pro'       -- Workspace tier: 'free', 'pro', 'enterprise'
    CHECK(plan IN ('free', 'pro', 'enterprise')),
  created_at TEXT NOT NULL,              -- ISO-8601 creation timestamp
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 3. `workspace_members`
Associates users with workspaces and defines their role inside that specific workspace.
```sql
CREATE TABLE IF NOT EXISTS workspace_members (
  id TEXT PRIMARY KEY,                   -- Unique membership record identifier
  workspace_id TEXT NOT NULL,            -- Associated workspace ID
  user_id TEXT NOT NULL,                 -- Associated user ID
  email TEXT NOT NULL,                   -- Member email address
  role TEXT NOT NULL DEFAULT 'member'    -- Role: 'owner', 'admin', 'member', 'viewer'
    CHECK(role IN ('owner', 'admin', 'member', 'viewer')),
  joined_at TEXT NOT NULL,               -- ISO-8601 membership timestamp
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(workspace_id, user_id)
);
```

#### 4. `shared_snippets`
Stores snippets, presets, tools data, and configurations shared by team members.
```sql
CREATE TABLE IF NOT EXISTS shared_snippets (
  id TEXT PRIMARY KEY,                   -- Unique snippet identifier (e.g., snp_123)
  workspace_id TEXT NOT NULL,            -- Associated workspace ID
  user_id TEXT NOT NULL,                 -- Creator user ID
  user_email TEXT NOT NULL,              -- Creator email address
  tool_id TEXT NOT NULL,                 -- Tool identifier (e.g., "json-formatter")
  tool_name TEXT NOT NULL,               -- Tool display title
  title TEXT NOT NULL,                   -- Snippet custom title
  content TEXT NOT NULL,                 -- Raw code, JSON, or configuration content
  type TEXT NOT NULL DEFAULT 'tool'      -- Type: 'tool', 'skill', 'design', 'mcp'
    CHECK(type IN ('tool', 'skill', 'design', 'mcp')),
  tags TEXT NOT NULL DEFAULT '[]',       -- JSON array of tags
  is_public INTEGER NOT NULL DEFAULT 0,  -- 0 = private to workspace, 1 = public
  created_at TEXT NOT NULL,              -- ISO-8601 creation timestamp
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 5. `audit_logs`
Activity and security logs for workspace auditing.
```sql
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,                   -- Unique audit entry identifier
  workspace_id TEXT NOT NULL,            -- Associated workspace ID
  user_id TEXT NOT NULL,                 -- Actor user ID
  user_email TEXT NOT NULL,              -- Actor email address
  action TEXT NOT NULL,                  -- Action code (e.g., "login", "create_snippet")
  details TEXT NOT NULL,                 -- Descriptive details or JSON payload
  created_at TEXT NOT NULL,              -- ISO-8601 event timestamp
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Indexes
The database defines optimized indexes for fast lookup and relational integrity:
- `idx_users_email` on `users(email)`
- `idx_members_workspace` on `workspace_members(workspace_id)`
- `idx_members_user` on `workspace_members(user_id)`
- `idx_snippets_workspace` on `shared_snippets(workspace_id)`
- `idx_audit_workspace` on `audit_logs(workspace_id)`

---

## 📦 Running Locally (Local SQLite Mode)

### 1. Prerequisites
Ensure you have **Node.js (v20+)** and **npm** installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate your environment variables:
```env
# Groq AI Key (get one at https://console.groq.com)
GROQ_API_KEY="gsk_your_groq_api_key_here"
GROQ_MODEL="llama-3.3-70b-versatile"

# Local SQLite Database (stored in data/ folder)
DATABASE_URL="file:data/local.db"

# JWT Secret Key for Session Authentication
JWT_SECRET="your_secure_random_jwt_secret_key"

# (Optional) Google OAuth 2.0 Client ID (https://console.cloud.google.com/apis/credentials)
VITE_GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"

PORT=3071
NODE_ENV="development"
```

### 4. Start Development Server
```bash
npm run dev
```
The server will automatically initialize the database schema in `data/local.db` and serve the application at:
👉 `http://localhost:3071`

---

## ☁️ Deployment to Vercel (Turso Cloud Mode)

1. Create a database on [Turso](https://turso.tech):
   ```bash
   turso db create dmlab-tools-db
   turso db show dmlab-tools-db --url
   turso db tokens create dmlab-tools-db
   ```
2. Configure Environment Variables in your **Vercel Dashboard** (`Project Settings > Environment Variables`):
   - `DATABASE_URL`: Your Turso database URL (`libsql://...`)
   - `TURSO_AUTH_TOKEN`: Your Turso authorization token
   - `GROQ_API_KEY`: Your Groq API key
   - `GROQ_MODEL`: `llama-3.3-70b-versatile`
   - `JWT_SECRET`: Random 32+ character cryptographic secret
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Web Client ID
   - `GOOGLE_CLIENT_ID`: Your Google OAuth Web Client ID
3. Deploy the application:
   ```bash
   vercel --prod
   ```

---

## 📄 License

Proprietary — Created for Digimetalab & DMLab Tools Suite. All rights reserved.
