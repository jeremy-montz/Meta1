// memory/memory-data.js — five configuration / memory layers across three platforms.
// Sourced from the original config-layers-matrix and remapped onto Claudemonzter tokens.

window.MEMORY_PLATFORMS = [
  { id: 'cli',      label: 'Claude Code CLI',     short: 'CLI',      sub: 'terminal · git-aware' },
  { id: 'cowork',   label: 'Cowork Desktop',      short: 'Cowork',   sub: 'desktop app · folder-mounted' },
  { id: 'claudeai', label: 'claude.ai Web/Mobile', short: 'claude.ai', sub: 'browser · projects' },
];

// Each layer gets a single CSS token name. Backgrounds + borders are derived in CSS
// via color-mix so we don't have to hand-tune light/border shades per theme.
window.MEMORY_LAYERS = [
  {
    id: 1,
    name: 'Identity',
    tokenColor: 'var(--accent)',
    persistence: 'permanent',
    updateFreq: 'rarely · quarterly',
    maxLines: '10–15 lines',
    question: 'Who am I and how do I want Claude to behave?',
    description: 'The immutable YOU. Personality, interaction rules, tone. Loaded every single session regardless of project.',
    whatBelongs: [
      'Your name, role, domain (1–2 sentences)',
      'Interaction meta-rules (confidence tagging, ask-before-assuming)',
      'Output format preferences (no emojis, minimal bullets)',
      'Behavioral contract (truth over comfort, challenge weak reasoning)',
      'Platform directives (mount X at session start)',
    ],
    whatDoesNot: [
      'Project details or agent identities',
      'Domain knowledge or expertise depth',
      'Anything over ~15 lines',
    ],
    overlap: 'All three auto-load identity. CLI uses a file; Cowork and claude.ai use a settings field. Only claude.ai adds auto-Memory on top.',
    cli: {
      location: '~/.claude/CLAUDE.md',
      label: 'User-level CLAUDE.md',
      desc: 'Auto-loaded every session, every project. Lives on your machine, not in any repo.',
      fileTree: '~/.claude/\n  CLAUDE.md          # ← Identity lives here\n  settings.json      # User-level permissions',
      howLoaded: 'Auto-loaded at session start. Lowest priority in the hierarchy, but always present.',
    },
    cowork: {
      location: 'Settings › Profile › Personal Preferences',
      label: 'Personal Preferences field',
      desc: 'A single text field in Cowork settings. Injected into every session’s system prompt.',
      fileTree: '[ no file on disk ]\nSettings › Profile › Personal Preferences\n  # text field in the UI\n  # ~15 lines max recommended',
      howLoaded: 'Injected into the system prompt automatically, every session, before any user message.',
    },
    claudeai: {
      location: 'Settings › Profile › "How would you like Claude to respond?"',
      label: 'Preferences + auto-Memory',
      desc: 'Same text field as Cowork. But claude.ai ALSO has auto-Memory that learns from conversations over time — a passive identity layer neither CLI nor Cowork has.',
      fileTree: '[ no file on disk ]\nSettings › Profile ›\n  "How would you like Claude to respond?"\n\n+ Auto-Memory (opaque, auto-learned)\n  # Claude observes your patterns\n  # you cannot view or edit this',
      howLoaded: 'Preferences injected into every session. Memory persists and updates opaquely from conversation.',
    },
  },

  {
    id: 2,
    name: 'Context',
    tokenColor: 'var(--info)',
    persistence: 'stable',
    updateFreq: 'quarterly',
    maxLines: '50–100 lines / file',
    question: 'What background does Claude need to calibrate its judgment?',
    description: 'Reference material about you — not instructions, but calibration data. Claude reads this to understand your world, not to follow step-by-step.',
    whatBelongs: [
      'about-me.md — background, expertise, professional context',
      'voice-style.md — real writing samples (3–5 paragraphs)',
      'working-rules.md — file formats, naming, review preferences',
      'Industry context, team structure, priorities',
    ],
    whatDoesNot: [
      'Step-by-step instructions (those are Layer 3)',
      'Behavioral meta-rules (those are Layer 1)',
      'Session-specific goals (that’s Layer 5)',
    ],
    overlap: 'CLI auto-imports via @syntax (reliable). Cowork requires prose ritual (fragile). claude.ai auto-loads from Project Knowledge (reliable but upload-only, no version control).',
    cli: {
      location: '~/.claude/ context files · @import',
      label: 'Imported context files',
      desc: 'Referenced via @import syntax from CLAUDE.md. Lives in ~/.claude/ for cross-project, or in project root for project-specific context.',
      fileTree: '~/.claude/\n  CLAUDE.md            # contains: @context/about-me.md\n  context/\n    about-me.md        # background, expertise\n    voice-style.md     # writing samples\n    working-rules.md   # how you like to work',
      howLoaded: 'Loaded via @import when CLAUDE.md is parsed. Only fetched if referenced.',
    },
    cowork: {
      location: 'Mounted folder · context/ subfolder',
      label: 'Context files in mounted folder',
      desc: 'Files you place in the mounted folder. NOT auto-loaded — must be referenced in CLAUDE.md or read by session ritual.',
      fileTree: 'Claudemonzter/           # mounted folder\n  context/\n    about-me.md          # background, expertise\n    voice-style.md       # writing samples\n    working-rules.md     # how you like to work',
      howLoaded: 'NOT auto-loaded. Must be explicitly read via session ritual or @import in root CLAUDE.md.',
    },
    claudeai: {
      location: 'Project › Project Knowledge (uploads)',
      label: 'Project Knowledge uploads',
      desc: 'Documents (PDF, doc, text) uploaded as "Knowledge" pinned to a Project. Available to every conversation in that project. No file system — upload only.',
      fileTree: '[ no file system access ]\nProject › Knowledge tab ›\n  about-me.pdf           # uploaded via UI\n  voice-samples.txt      # uploaded via UI\n  working-rules.docx     # uploaded via UI\n\n# max ~10MB per file\n# pinned to this project only',
      howLoaded: 'Auto-loaded for every conversation within the project. Available immediately — no ritual needed.',
    },
  },

  {
    id: 3,
    name: 'Project',
    tokenColor: 'var(--ok)',
    persistence: 'per project',
    updateFreq: 'per release · milestone',
    maxLines: 'under 200 lines',
    question: 'What rules and architecture govern THIS project?',
    description: 'The operating manual for a specific codebase or vault. Defines what Claude can / can’t do here. CLI version is git-shared; Cowork and claude.ai versions are per-user.',
    whatBelongs: [
      'Project architecture overview',
      'Directory structure and conventions',
      'File access policy (writable, read-only, never-touch)',
      'Build/test commands (CLI) or skill triggers (Cowork)',
      'Anti-patterns specific to this project',
      'Cross-cutting rules for all agents / sessions',
    ],
    whatDoesNot: [
      'Personal identity or preferences (Layer 1)',
      'Background knowledge about you (Layer 2)',
      'Agent-specific scope or procedures (Layer 4)',
    ],
    overlap: 'All three auto-load project config. CLI is richest (files, hierarchy, git). Cowork has two mechanisms: UI text field + mounted CLAUDE.md (interaction undocumented). claude.ai has UI text field only — simplest, no versioning, no file access.',
    cli: {
      location: './CLAUDE.md at project root',
      label: 'Project-root CLAUDE.md',
      desc: 'Auto-loaded when Claude opens in this directory. Checked into git. Shared with collaborators. Walks UP the tree loading all ancestor CLAUDE.md files too.',
      fileTree: 'my-project/\n  CLAUDE.md              # ← project rules (committed)\n  CLAUDE.local.md        # personal overrides (gitignored)\n  .claude/\n    settings.json        # team permissions & hooks\n    settings.local.json  # personal permission overrides',
      howLoaded: 'Auto-loaded when CLI runs in this directory. Walks UP the tree — loads all ancestor CLAUDE.md files too.',
    },
    cowork: {
      location: 'Project Instructions + CLAUDE.md (mounted)',
      label: 'Two mechanisms · UI + file',
      desc: 'Two mechanisms. (1) Project Instructions text field in the Cowork UI (per-project, same feature as claude.ai). (2) CLAUDE.md at the mount point. Both load — precedence between them is undocumented. CLAUDE.md does NOT walk subdirectories.',
      fileTree: 'Cowork Project Settings ›\n  Instructions (+ button in sidebar)\n  # UI text field, per-project\n\nClaudemonzter/           # mounted folder\n  CLAUDE.md              # ← file-based rules\n  .claude/\n    config/              # skill configs, credentials\n    skills/              # installed skill source files',
      howLoaded: 'Both auto-load. UI instructions load via project. CLAUDE.md loads if present at mount point. Does NOT walk subdirectories.',
    },
    claudeai: {
      location: 'Project › Custom Instructions',
      label: 'Project Instructions field',
      desc: 'A freeform text field per Project — same feature as Cowork’s Project Instructions. No file, no version control, no CLAUDE.md, no file-system access. UI-only.',
      fileTree: '[ no file on disk ]\nProject › Settings ›\n  "Set custom instructions for this project"\n  # freeform text box\n  # no version control\n  # no @import syntax\n  # no settings.json equivalent',
      howLoaded: 'Auto-loaded for every conversation within the project. Always present.',
    },
  },

  {
    id: 4,
    name: 'Agent · Role',
    tokenColor: 'var(--candle)',
    persistence: 'scoped',
    updateFreq: 'when scope changes',
    maxLines: 'under 100 lines / role',
    question: 'What additional context does THIS specific role need?',
    description: 'Conditional configuration loaded only when working in a specific role, domain, or file path. Keeps project config lean by scoping context.',
    whatBelongs: [
      'Agent identity (name, scope, paired agent)',
      'Domain-specific procedures and checklists',
      'Agent-specific file access permissions',
      'Deviations from root contract',
      'Domain knowledge relevant only to this role',
    ],
    whatDoesNot: [
      'Cross-cutting project rules (Layer 3)',
      'Personal preferences (Layer 1)',
      'Session state or current goals (Layer 5)',
    ],
    overlap: 'CLI auto-loads by file path (elegant, reliable). Cowork depends on session ritual (fragile). claude.ai has no equivalent — this layer simply doesn’t exist.',
    cli: {
      location: '.claude/rules/ · path-scoped YAML',
      label: 'Rules files with path globs',
      desc: 'Path-scoped rules auto-load based on which files Claude is working with. YAML frontmatter specifies file patterns. Zero-cost when not triggered.',
      fileTree: '.claude/\n  rules/\n    meta1.md             # paths: ["projects/Meta1/**"]\n    bond.md              # paths: ["projects/Bond/**"]\n    house.md             # paths: ["projects/House/**"]\n    wiki-rules.md        # paths: ["wiki/**"]\n  agents/\n    security-review.md   # subagent definitions',
      howLoaded: 'Auto-loaded when Claude reads/edits files matching the paths: glob in frontmatter. Zero-cost when not triggered.',
    },
    cowork: {
      location: 'Agent CLAUDE.md + Skills',
      label: 'Subdir CLAUDE.md + Skills',
      desc: 'Cowork doesn’t have path-scoped rules. Two workarounds: (1) agent CLAUDE.md files loaded by session ritual, (2) Skills that activate on trigger phrases.',
      fileTree: 'Claudemonzter/\n  projects/\n    Meta1/CLAUDE.md      # loaded by ritual, not auto\n    Bond/CLAUDE.md       # loaded by ritual, not auto\n  skills/\n    gh-issue-create.skill\n    wiki-write.skill     # domain skill = scoped context',
      howLoaded: 'NOT auto-loaded. Session ritual must explicitly load the right agent CLAUDE.md. Skills load on trigger match.',
    },
    claudeai: {
      absent: true,
      location: 'not available',
      label: 'no equivalent',
      desc: 'claude.ai has no mechanism for conditional or role-scoped configuration. No path-scoped rules, no skills, no agent definitions. Everything must go in Project Instructions (Layer 3) or conversation.',
      fileTree: '[ no equivalent ]\n# no path-scoped rules\n# no skills system\n# no agent / subagent definitions\n# no conditional loading of any kind\n\n# workaround: paste role context into\n# the conversation when switching tasks',
      howLoaded: 'Not applicable. You must manually provide role context in conversation or cram it into Project Instructions.',
    },
  },

  {
    id: 5,
    name: 'Session',
    tokenColor: 'var(--err)',
    persistence: 'ephemeral',
    updateFreq: 'every session',
    maxLines: 'conversation context',
    question: 'What is Claude doing RIGHT NOW?',
    description: 'The active working context. Current goals, session type, blockers, and state carried from previous sessions. The only layer Claude itself writes back to.',
    whatBelongs: [
      'Current goal / task at hand',
      'Session type (exploration, production, triage, review)',
      'Active blockers or open questions',
      'State from previous session (if resuming)',
      'Open ritual outputs (flagged items, priority surface)',
    ],
    whatDoesNot: [
      'Persistent rules (Layers 1–4)',
      'Background knowledge (Layer 2)',
      'Architecture decisions (Layer 3)',
    ],
    overlap: 'CLI: transparent, editable memory (MEMORY.md) + session resume. Cowork & claude.ai: opaque auto-memory with ~24h cycle. Only CLI lets you see and edit what Claude remembers.',
    cli: {
      location: 'conversation + auto-memory + --continue',
      label: 'Session state + auto-memory',
      desc: 'CLI persists sessions locally. Auto-memory (MEMORY.md) captures cross-session learnings. Resume with --continue or --resume.',
      fileTree: '~/.claude/projects/<project>/\n  memory/\n    MEMORY.md            # auto-memory index (200 lines loaded)\n    debugging.md         # topic files (on-demand)\n  sessions/\n    <session-id>.jsonl   # session transcript',
      howLoaded: 'Sessions persist and resume. Auto-memory loads top 200 lines. Topic files load on-demand when relevant.',
    },
    cowork: {
      location: 'conversation + ritual + manual state',
      label: 'Session ritual + project memory',
      desc: 'Standalone sessions start fresh. Cowork Projects have memory (24h update cycle, opaque). Session ritual can load manual state files.',
      fileTree: '[ in Cowork UI · not on disk ]\nCowork Project memory (if using Projects)\nOR\nmanual state file in vault:\n  Claudemonzter/\n    .session-state.md    # optional manual state carry',
      howLoaded: 'Fresh each standalone session. Cowork Projects retain opaque memory. Ritual must load any state file manually.',
    },
    claudeai: {
      location: 'conversation within a Project',
      label: 'Project conversations + memory',
      desc: 'Conversations persist within Projects. Claude’s auto-Memory synthesizes learnings every ~24 hours. You can resume any conversation. No manual state files.',
      fileTree: '[ in cloud · not on disk ]\nProject ›\n  Conversations (persistent, resumable)\n  Auto-Memory (opaque, 24h update cycle)\n\n# no manual state files\n# no --continue equivalent\n# memory is not readable or editable',
      howLoaded: 'Conversations persist natively. Memory auto-updates from conversations. Cannot be inspected or edited.',
    },
  },
];

// Cross-platform conclusions surfaced under the matrix.
window.MEMORY_BRIDGES = {
  reliable: [
    { layer: 1, text: 'Personal Preferences — same field in Cowork & claude.ai; same content in CLI’s ~/.claude/CLAUDE.md' },
    { layer: 3, text: 'Project rules — Cowork & claude.ai share the Project Instructions field; CLAUDE.md content pastes alongside in Cowork' },
  ],
  fragile: [
    { layer: 2, text: 'Context files — different upload / mount mechanisms per platform' },
    { layer: 4, text: 'Agent / Role scoping — CLI-only; absent on claude.ai' },
    { layer: 5, text: 'Memory — three separate, incompatible systems' },
  ],
};
