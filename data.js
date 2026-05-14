/* ============================================================================
 * data.js · CLAUDEMONZTER CONTENT FILE
 * ----------------------------------------------------------------------------
 * Edit this file to change site content. No JSX, no React, just JavaScript
 * arrays and objects. The structure is JSON-like — strings need quotes, lines
 * end with commas inside arrays/objects.
 *
 * What lives here:
 *   ME        — your bio, contact, name (top of every page)
 *   NOW       — the "Under the lamp" bullets on the homepage
 *   PORTFOLIO — the short Portfolio Projects list (homepage)
 *   ARTICLES  — recent writing entries (homepage + writing index)
 *   PROJECTS  — the four lab projects (graph + lab snapshot)
 *   AGENTS    — the eight agents (graph nodes, inspector cards)
 *   LEVELS    — the L1-L5 chip set on agent cards
 *
 * Quick edits:
 *   - Update NOW       → change weekly to reflect current focus.
 *   - Add ARTICLE      → copy an existing block, change the fields, add comma.
 *   - Add AGENT        → same pattern; pick a project id that exists below.
 *   - Update bio       → edit the ME block at top.
 *
 * Files I depend on:
 *   none. This is loaded as plain JS via <script src="data.js"></script>
 *   BEFORE the JSX components. The components read these as globals.
 * ========================================================================== */

window.ME = {
  name:     'Jeremy Montz',
  title:    'senior product manager · operator · learning AI in public',
  blurb:    'I run product. Lately I run experiments. Claudemonzter is my first lab — an operator-plus-agents practice where I plug a small graph of projects into a much larger graph of models, and document what happens.',
  location: 'Brooklyn, NY',
  github:   'github.com/JeremyMontz',           // also the username for the live activity feed
  ghUser:   'JeremyMontz',                       // ← GitHub username, used by the live activity feed
  linkedin: 'linkedin.com/in/jeremymontz',
  est:      'EST. 03/2026',
};

// ─── SPEC · the recruiter-facing summary card on portfolio.html ───────────
// Key/value rows for the spec block in the portfolio hero. Update freely —
// these are placeholders I wrote on your behalf.
window.SPEC = [
  ['ROLE',      'SENIOR PRODUCT MANAGER'],
  ['STAGE',     'B2B SaaS · 0→1 + 1→N'],
  ['DEPTH',     '12 YEARS'],
  ['STACK',     'PM · OPS · LIGHT BUILD'],
  ['FOCUS',     'AI-NATIVE PRODUCT'],
  ['AVAILABLE', 'Q3 2026 →'],
];

// ─── NOW · what I'm working on right now ──────────────────────────────────
// Update weekly. 1-4 bullets max — this is a status message, not a story.
window.NOW = [
  'Relaunching claudemonzter online — homepage, then a proper graph view.',
  'Wrapping up "First Month" (long-form, half lab notebook half confession).',
  'Negotiating with my own pantry inventory agent. It keeps winning.',
];

// ─── PORTFOLIO · selected work ────────────────────────────────────────────
// Each entry is a short card on the homepage's Showcase rail. The longer
// version lives on the portfolio page itself.
//
// fields:
//   id      — slug, unique
//   no      — display number, e.g. '01'
//   title   — display title
//   blurb   — 1-sentence description
//   status  — short label, e.g. 'WIP', 'LIVE', 'TBD'
//   tone    — 'warn' for WIP, 'na' for placeholder, 'ok' for shipped
//   tag     — short uppercase tag
//   href    — link target
//   date    — display date string
window.PORTFOLIO = [
  {
    id: 'house-tracker',
    no: '01',
    title: 'House Tracker',
    blurb: 'A renovation tracker on top of the Pura-Vida project. Timeline, budget, contractor notes — all in one operator-readable view.',
    status: 'LIVE',
    tone: 'ok',
    tag: 'INTERACTIVE',
    href: 'agents/house/house.html',
    date: '03/2026 →',
  },
  {
    id: 'first-month',
    no: '02',
    title: 'First Month',
    blurb: 'A reckoning with the first thirty days of running Claudemonzter — what worked, what slept, what bit.',
    status: 'WIP',
    tone: 'warn',
    tag: 'WRITING + INTERACTIVE',
    href: 'first-month-v2.html',
    date: '04/2026 →',
  },
  {
    id: 'project-03',
    no: '03',
    title: 'Project 03',
    blurb: 'A third slot left open on purpose. Shape depends on what 02 teaches.',
    status: 'TBD',
    tone: 'na',
    tag: 'PLANNED',
    href: '#',
    date: '— · —',
  },
];

// ─── ARTICLES · writing & field notes ─────────────────────────────────────
// Each entry shows on the homepage's writing list. To add one:
//   1. Drop a new HTML file in writing/<slug>.html (copy an existing one).
//   2. Add an entry below with its date, title, tag, read time, and href.
window.ARTICLES = [
  { id: 'a1', date: '05·12', title: 'Agents argue with their own memory.',     tag: 'ESSAY',   read: '4 min', href: 'writing/agents-argue-with-memory.html' },
  { id: 'a2', date: '05·05', title: 'On the mullet as a design principle.',    tag: 'NOTE',    read: '2 min', href: '#' },
  { id: 'a3', date: '04·28', title: 'The canon-integrity test as a way of life.', tag: 'ESSAY', read: '7 min', href: '#' },
  { id: 'a4', date: '04·19', title: 'I built a pantry. The pantry built me back.', tag: 'LAB LOG', read: '3 min', href: '#' },
];

// ─── PROJECTS · the four lab projects ─────────────────────────────────────
// Each project is a node in the inner ring of the homepage graph. Agents
// (below) reference these by id. Add a project here BEFORE adding agents
// that point at it.
window.PROJECTS = [
  { id: 'meta1',     label: 'META1',     blurb: 'the operator stack itself · canon, agents, runs',          tone: 'accent' },
  { id: 'pura-vida', label: 'PURA-VIDA', blurb: 'life-engineering · house, money, learning, valuation',     tone: 'info'   },
  { id: 'phil',      label: 'PHIL',      blurb: 'consciousness inquiry · open threads',                     tone: 'ok'     },
  { id: 'self',      label: 'SELF',      blurb: 'the operator on the record',                               tone: 'warn'   },
];

// ─── AGENTS · the eight agents (canonical) ────────────────────────────────
// These power the graph's outer ring and the inspector cards. The shape
// matches the live Agent Status dashboard exactly. In production this will
// come from the Google Sheet via GAS; for now these are placeholders to
// give the homepage and inspector something to render.
//
// fields:
//   id        — slug, unique
//   name      — display name (e.g. 'House')
//   project   — id of one of the PROJECTS above
//   role      — short role, e.g. 'architect'
//   blurb     — italic one-liner shown on the card
//   mood      — single-word mood
//   state     — 'active' or 'flagged'
//   flag      — optional alert string (only renders when set)
//   session   — last session summary
//   lastSeen  — display timestamp
window.AGENTS = [
  { id: 'meta1',    name: 'Meta1',    project: 'meta1',     role: 'architect',
    blurb:    'The architect. Proposes structures. Defers direction to Jeremy.',
    mood:     'Constructive', state: 'active',
    session:  'Designed checkin schema for agent self-reporting. Reviewed v2 canon integrity rules. Drafted design doc v0.2.',
    lastSeen: 'May 13, 6:00 PM' },
  { id: 'bond',     name: 'Bond',     project: 'meta1',     role: 'gatekeeper',
    blurb:    'The gatekeeper. Tests what Meta1 builds. Ships what passes.',
    mood:     'Sharp', state: 'active',
    session:  'Ran test suite against skill-catalog wiki article. Two QC items flagged for Meta1.',
    lastSeen: 'May 13, 6:00 PM' },
  { id: 'house',    name: 'House',    project: 'pura-vida', role: 'project manager',
    blurb:    'The project manager. Tracks renovation scope, budget, timeline.',
    mood:     'Steady', state: 'active', flag: 'Permit approval delayed — City backlog, 3 week estimate',
    session:  'Reviewed contractor bids for bathroom tile. Updated budget tracker. Permit timeline slipping.',
    lastSeen: 'May 13, 6:00 PM' },
  { id: 'freedom',  name: 'Freedom',  project: 'pura-vida', role: 'advocate',
    blurb:    'The advocate. Financial independence, debt strategy, milestone tracking.',
    mood:     'Determined', state: 'active',
    session:  'Reviewed Q2 debt paydown schedule. Updated milestone tracker with April actuals.',
    lastSeen: 'May 13, 6:00 PM' },
  { id: 'evolve',   name: 'Evolve',   project: 'pura-vida', role: 'coach',
    blurb:    'The coach. AI career development, learning log, skill assessment.',
    mood:     'Grounded', state: 'active',
    session:  'Updated active learning log with Claude Code patterns. Reviewed coaching register alignment.',
    lastSeen: 'May 11, 6:00 PM' },
  { id: 'assessor', name: 'Assessor', project: 'pura-vida', role: 'analyst',
    blurb:    'The analyst. Property assessment, comparable research, valuation.',
    mood:     'Methodical', state: 'active',
    session:  'Pulled comparable sales for Q1. Updated valuation model with new assessment data.',
    lastSeen: 'May 13, 6:00 PM' },
  { id: 'phil',     name: 'Phil',     project: 'phil',      role: 'philosopher',
    blurb:    'The philosopher. Consciousness inquiry, lived experience, open threads.',
    mood:     'Present', state: 'active',
    session:  'Explored the what-is-it-like thread through PKD and Ramana. Updated open-threads.md.',
    lastSeen: 'May 13, 6:00 PM' },
  { id: 'jeremy',   name: 'Jeremy',   project: 'self',      role: 'self',
    blurb:    'The operator. The one who flags himself.',
    mood:     'curious', state: 'flagged', flag: 'Yes — pirate',
    session:  '', lastSeen: 'May 13, 9:06 PM' },
];

// ─── LEVELS · the L1-L5 chip set on agent cards ───────────────────────────
// You probably don't need to touch this unless the dashboard's level system
// changes. The colors flow from the design-system tokens.
window.LEVELS = [
  { id: 'L1', tone: 'info' },
  { id: 'L2', tone: 'info' },
  { id: 'L3', tone: 'ok'   },
  { id: 'L4', tone: 'warn' },
  { id: 'L5', tone: 'err'  },
];
