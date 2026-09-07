import { DesignSystemItem } from '../types';

export const DESIGN_DATA: DesignSystemItem[] = [
  {
    id: 'design-tactile-neumorphism',
    name: 'Tactile Neumorphism (Soft Physical UI)',
    slug: 'tactile-neumorphism',
    archetype: 'tactile-neumorphism',
    tagline: 'Precision extruded surfaces, dual-source shadows, and physical tactile click states',
    description: 'A refined soft-tactile design system featuring mathematical dual-shadow elevations, extruded buttons, pressed active states, and soothing neutral contrast ratios for reduced eye fatigue.',
    author: 'DMLab Design Labs',
    badge: 'Popular',
    primaryColor: '#6C63FF',
    accentColor: '#8B84FF',
    bgTone: '#EBECF0 (Light) / #1E222B (Dark)',
    contrastRatio: '7.8:1 (AAA High Contrast)',
    typographyHeading: 'Plus Jakarta Sans, Inter Display',
    typographyBody: 'Inter, system-ui, sans-serif',
    mathScale: 'Major Second (1.125) / Low Density Product',
    cornerRadii: { sm: '12px', md: '16px', lg: '24px', pill: '9999px' },
    antiSlopRules: [
      'Dual-source opposing directional shadows only (#ffffff highlight + #b8b9be shadow).',
      'Never mix thick 1px hairline black borders with soft pneumatic depth.',
      'Active buttons must depress via inset bevel shadows without layout jitter.',
      'Container padding must always equal or exceed child gap spacing.',
      'Inner corner radius formula: R_inner = R_outer - Padding.',
    ],
    rawMarkdown: `# DESIGN.md — Tactile Neumorphism Specification

## Archetype & Core Philosophy
Tactile Neumorphism bridges digital screens and physical mechanical surfaces through calibrated dual-source lighting.

## Color Tokens & Surfaces
- Canvas Light: \`#EBECF0\`
- Canvas Dark: \`#1E222B\`
- Primary Accent: \`#6C63FF\` (Indigo Core)
- Text High Contrast: \`#1E293B\` (Slate 800)
- Text Muted: \`#64748B\` (Slate 500)

## CSS Shadow Tokens
\`\`\`css
.neu-flat {
  background: #EBECF0;
  box-shadow: 6px 6px 14px #d1d9e6, -6px -6px 14px #ffffff;
}

.neu-pressed {
  background: #EBECF0;
  box-shadow: inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff;
}

.neu-convex {
  background: linear-gradient(145deg, #fbfcfe, #d4d5d9);
  box-shadow: 5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff;
}
\`\`\`

## Typography & Hierarchy
- H1 Display: 28px–36px / ExtraBold / tracking -0.02em
- Body Text: 14px–16px / Regular / line-height 1.6
`,
    tailwindTokens: `// tailwind.config.js snippet
module.exports = {
  theme: {
    extend: {
      colors: {
        neu: {
          base: '#EBECF0',
          dark: '#1E222B',
          accent: '#6C63FF',
        }
      }
    }
  }
}`,
    cssVariables: `:root {
  --neu-bg: #EBECF0;
  --neu-accent: #6C63FF;
  --neu-shadow-dark: #d1d9e6;
  --neu-shadow-light: #ffffff;
}`,
    tags: ['Neumorphism', 'Tactile UI', 'Soft UI', 'Dual Shadow', 'Physicality', 'Design System'],
  },
  {
    id: 'design-swiss-minimalism',
    name: 'Swiss International Typographic Style',
    slug: 'swiss-minimalism',
    archetype: 'swiss-minimalism',
    tagline: 'Strict asymmetric grid, oversized grotesque typography, and objective clarity',
    description: 'An authentic Swiss modernist framework prioritizing mathematical column grids, bold monochrome typography, generous negative space, and functional zero-noise hierarchy.',
    author: 'Modernist Guild',
    badge: 'Featured',
    primaryColor: '#000000',
    accentColor: '#FF3B30',
    bgTone: '#FAFAFA (Pure Off-White)',
    contrastRatio: '14.2:1 (Maximum Contrast)',
    typographyHeading: 'Helvetica Neue, Archivo, Neue Haas Grotesk',
    typographyBody: 'Inter, system-ui, sans-serif',
    mathScale: 'Perfect Fourth (1.333) / High Contrast',
    cornerRadii: { sm: '0px', md: '4px', lg: '8px', pill: '0px' },
    antiSlopRules: [
      'No decorative gradients or arbitrary box shadows.',
      'Borders must be crisp 1px solid high-contrast dividers.',
      'Labels must sit strictly on one line without hyphenation.',
      'Negative space is a first-class structural element; avoid filling every gap.',
    ],
    rawMarkdown: `# DESIGN.md — Swiss International Typography Spec

## Core Tenets
1. **Grid Discipline**: Standard 12-column mathematical grid with 24px baseline rhythms.
2. **Typography as Structure**: Hierarchy is achieved purely through scale and weight, not decoration.
3. **Accent Restraint**: Red (\`#FF3B30\`) or Cobalt (\`#0044FF\`) used only for critical calls to action.
`,
    tailwindTokens: `module.exports = {
  theme: {
    fontFamily: {
      display: ['"Neue Haas Grotesk"', 'sans-serif'],
    }
  }
}`,
    cssVariables: `:root {
  --swiss-black: #111111;
  --swiss-white: #fafafa;
  --swiss-accent: #ff3b30;
}`,
    tags: ['Swiss Design', 'Minimalism', 'Typography', 'Grid System', 'Editorial'],
  },
  {
    id: 'design-dark-luxury',
    name: 'Dark Luxury & High-Density Obsidian',
    slug: 'dark-luxury-obsidian',
    archetype: 'dark-luxury',
    tagline: 'Warm obsidian canvases, brushed titanium accents, and subtle gold hairline highlights',
    description: 'A prestige dark theme crafted for developer workstations and fintech analytics. Features deep charcoal tones (<5% warm amber saturation) with subtle luminescent borders.',
    author: 'Apex Foundry',
    primaryColor: '#E2B857',
    accentColor: '#38BDF8',
    bgTone: '#0F1115 (Obsidian Slate)',
    contrastRatio: '9.4:1',
    typographyHeading: 'Cinzel, Outfit, Plus Jakarta Sans',
    typographyBody: 'Geist, JetBrains Mono, sans-serif',
    mathScale: 'Major Third (1.250)',
    cornerRadii: { sm: '8px', md: '12px', lg: '18px', pill: '9999px' },
    antiSlopRules: [
      'Brightness difference between container and backdrop must not exceed 12%.',
      'No garish blue-purple glowing borders.',
      'Monospaced typography used deliberately for numerical data and metrics.',
    ],
    rawMarkdown: `# DESIGN.md — Dark Luxury Obsidian Spec

## Palette
- Canvas Base: \`#0F1115\`
- Elevated Card: \`#161A22\`
- Amber Core: \`#E2B857\`
- Muted Slate: \`#8B949E\`
`,
    tailwindTokens: `module.exports = {
  theme: {
    extend: {
      colors: {
        obsidian: '#0F1115',
        cardDark: '#161A22',
        goldAccent: '#E2B857',
      }
    }
  }
}`,
    cssVariables: `:root {
  --obsidian-bg: #0F1115;
  --card-bg: #161A22;
  --accent-gold: #E2B857;
}`,
    tags: ['Dark Mode', 'Obsidian', 'Luxury', 'Fintech', 'Developer UI'],
  },
  {
    id: 'design-bento-editorial',
    name: 'Bento Grid & High-Utility Dashboard',
    slug: 'bento-editorial-grid',
    archetype: 'bento-editorial',
    tagline: 'Modular bento partitions, micro-interactions, and asymmetric data cards',
    description: 'Engineered for dense SaaS applications and dashboards. Uses responsive CSS subgrids, clear visual anchors, proportional pill badges, and contextual action trays.',
    author: 'Bento UI Collective',
    primaryColor: '#3B82F6',
    accentColor: '#10B981',
    bgTone: '#F8FAFC',
    contrastRatio: '8.1:1',
    typographyHeading: 'Cabinet Grotesk, Inter',
    typographyBody: 'Inter, sans-serif',
    mathScale: 'Minor Third (1.200)',
    cornerRadii: { sm: '12px', md: '20px', lg: '28px', pill: '9999px' },
    antiSlopRules: [
      'Bento cells must have clear functional distinctiveness (hero cell, stats cell, chart cell).',
      'No empty filler slots or fake placeholder cards.',
      'Grid gaps must remain strictly uniform across rows and columns.',
    ],
    rawMarkdown: `# DESIGN.md — Bento Grid Dashboard Spec

## Grid System Layout
\`\`\`html
<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
  <div class="md:col-span-2 p-6 rounded-3xl bg-white border border-slate-200">
    <!-- Hero interactive widget -->
  </div>
  <div class="p-6 rounded-3xl bg-white border border-slate-200">
    <!-- Micro stats -->
  </div>
</div>
\`\`\`
`,
    tailwindTokens: `module.exports = {
  theme: {
    extend: {
      gridTemplateColumns: {
        'bento': 'repeat(auto-fit, minmax(280px, 1fr))',
      }
    }
  }
}`,
    cssVariables: `:root {
  --bento-bg: #f8fafc;
  --bento-card: #ffffff;
}`,
    tags: ['Bento Grid', 'Dashboard', 'SaaS', 'Layout', 'UI Components'],
  },
];
