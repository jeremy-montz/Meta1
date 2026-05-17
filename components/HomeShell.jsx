// HomeShell.jsx — shared atoms and the AgentCard primitive.
// ── Auto-detect site root ──────────────────────────────────────────────
// Every page loads data.js with the correct relative path. We extract
// that path prefix so all components resolve links without per-page config.
const _SITE_BASE = (() => {
  const tag = document.querySelector('script[src$="data.js"]');
  if (tag) return tag.getAttribute('src').replace('data.js', '');
  return '';
})();

// Content data (ME, PORTFOLIO, AGENTS, etc.) lives in data.js — edit that
// file to update site content. This file only defines UI building blocks.

// Hardcoded scaffolding used by the old A/B/C exploration variants.
// Not used by the live homepage or portfolio page; safe to ignore.
const DOMAINS = [
  { id: 'canon',     label: 'CANON',     blurb: 'source of truth · file reconciliation' },
  { id: 'checkin',   label: 'CHECK-IN',  blurb: 'human log · mood + notes' },
  { id: 'house',     label: 'HOUSE',     blurb: 'home as a system · rooms, things' },
  { id: 'pantry',    label: 'PANTRY',    blurb: 'ledger of edible inventory' },
  { id: 'inventory', label: 'INVENTORY', blurb: 'everything else worth tracking' },
  { id: 'dashboard', label: 'DASHBOARD', blurb: 'the operator console' },
  { id: 'ledger',    label: 'LEDGER',    blurb: 'agents, runs, receipts' },
];
const GRAPH_PROJECTS = [
  { id: 'claudemonzter', label: 'CLAUDEMONZTER',  state: 'live' },
  { id: 'project-02',    label: 'PROJECT 02',     state: 'planned' },
  { id: 'project-03',    label: 'PROJECT 03',     state: 'planned' },
];

// Retained-but-fallback activity feed. The homepage now pulls real GitHub
// events at runtime via <LiveActivity>; this list is rendered only as a
// graceful fallback when the GitHub API is unreachable.
const ACTIVITY = [
  { t: '00:02', kind: 'COMMIT',   tone: 'accent', msg: 'index.html — homepage relaunch, draft 4' },
  { t: '00:41', kind: 'CHECK-IN', tone: 'info',   msg: 'mood: focused · slept 7h · zero anxiety' },
  { t: '03:11', kind: 'AGENT',    tone: 'ok',     msg: 'canon reconciliation · 0 orphans' },
  { t: '11:08', kind: 'COMMIT',   tone: 'accent', msg: 'first-month.html — added July note' },
  { t: '14:22', kind: 'AGENT',    tone: 'warn',   msg: 'pantry ledger · cardamom missing (R!)' },
  { t: '18:00', kind: 'CHECK-IN', tone: 'info',   msg: 'evening recap · 3 wins, 1 bite' },
];

// --- Small layout atoms ----------------------------------------------------
const NavStrip = ({ tone = 'lab', dense, hide }) => {
  if (hide) return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: `${dense ? '14px' : '20px'} 40px`,
      borderBottom: `1px solid var(--line)`,
      gap: 24,
    }}>
      <Wordmark size={tone === 'cabaret' ? 32 : 26} tick={!dense} />
      <nav style={{
        display: 'flex', gap: 22,
        fontFamily: 'var(--font-mono)', fontSize: 11,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'var(--fg-muted)',
      }}>
        <a href="#portfolio">Portfolio</a>
        <a href="#graph">Current Graph</a>
        <a href="#articles">Writing</a>
        <a href="#about">About</a>
      </nav>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: 'var(--font-mono)', fontSize: 10,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'var(--fg-subtle)',
      }}>
        <StatusDot tone="ok" glow />
        <span>LAB 001 · LIVE</span>
      </div>
    </div>
  );
};

const SectionHeader = ({ no, eyebrow, title, sub }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 6 }}>
      {no && <Tick>{`// ${no}`}</Tick>}
      <Eyebrow>{eyebrow}</Eyebrow>
    </div>
    <h2 style={{ marginBottom: sub ? 6 : 0 }}>{title}</h2>
    {sub && <p style={{ color: 'var(--fg-subtle)', maxWidth: 560 }}>{sub}</p>}
  </div>
);

const ContactRow = ({ align = 'left' }) => (
  <div style={{
    display: 'flex', gap: 20, alignItems: 'center',
    justifyContent: align === 'center' ? 'center' : 'flex-start',
    fontFamily: 'var(--font-mono)', fontSize: 12,
    letterSpacing: '0.14em', textTransform: 'uppercase',
    color: 'var(--fg-muted)',
  }}>
    <a href={_SITE_BASE + "agents/jeremy/jeremy.html"} style={{ display: 'inline-flex', gap: 8, alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
      <span style={{ color: 'var(--accent)' }}>↗</span> ABOUT
    </a>
    <span style={{ color: 'var(--line-loud)' }}>·</span>
    <a href={`https://${ME.github}`} style={{ display: 'inline-flex', gap: 8, alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
      <span style={{ color: 'var(--accent)' }}>↗</span> GITHUB
    </a>
    <span style={{ color: 'var(--line-loud)' }}>·</span>
    <a href={`https://${ME.linkedin}`} style={{ display: 'inline-flex', gap: 8, alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
      <span style={{ color: 'var(--accent)' }}>↗</span> LINKEDIN
    </a>
    <span style={{ color: 'var(--line-loud)' }}>·</span>
    <span>{ME.location}</span>
  </div>
);

const Footer = () => (
  <div style={{
    padding: '30px 40px 40px',
    borderTop: '1px solid var(--line)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
    gap: 24,
  }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Wordmark size={20} tick={false}/>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'var(--fg-faint)',
      }}>
        EST. 03/2026 · {(window.SITE?.version || 'v3.3').toUpperCase()}
      </div>
    </div>
    <ContactRow />
  </div>
);

// Mascot inline — line drawing from the design system. We reference the file
// from /design-system/. Used as <Mascot size={...} />.
const Mascot = ({ size = 96, color }) => (
  <img
    src={_SITE_BASE + "design-system/assets/mascot.svg"}
    alt=""
    style={{
      width: size, height: 'auto', display: 'block',
      filter: color ? `drop-shadow(0 0 24px ${color})` : 'none',
    }}
  />
);

// TopNav — shared chrome across home + portfolio pages.
const TopNav = ({ active }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '22px 40px', borderBottom: '1px solid var(--line)',
    gap: 32,
  }}>
    <div style={{ flexShrink: 0 }}>
      <Wordmark size={26} tick={false} />
    </div>
    <nav style={{
      display: 'flex', gap: 26, flex: 1, justifyContent: 'center',
      fontFamily: 'var(--font-mono)', fontSize: 11,
      letterSpacing: '0.18em', textTransform: 'uppercase',
    }}>
      {[
        ['HOME',      'index.html'],
        ['PORTFOLIO', 'portfolio.html'],
        ['GRAPH',     'dashboard.html'],
        ['WRITING',   'writing.html'],
      ].map(([label, href]) => (
        <a key={label} href={_SITE_BASE + href} style={{
          color: label === active ? 'var(--accent)' : 'var(--fg-muted)',
          borderBottom: label === active ? '1px solid var(--accent)' : '1px solid transparent',
          paddingBottom: 4,
        }}>{label}</a>
      ))}
    </nav>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      fontFamily: 'var(--font-mono)', fontSize: 10,
      letterSpacing: '0.22em', textTransform: 'uppercase',
      color: 'var(--fg-subtle)',
    }}>
      <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ok)', color: 'var(--ok)' }} />
      {(window.SITE?.version || 'v3.3').toUpperCase()} · {(window.SITE?.status || 'LIVE').toUpperCase()}
    </div>
  </div>
);

// AgentCard — mirrors the dashboard.html agent card visual. Used in graph
// inspector popovers and on the recruiter portfolio page. Title is Fraunces,
// labels are mono, the L1-L5 dots ride along the top, session blurb sits
// below a SESSION SUMMARY divider.
const AgentCard = ({ agent, compact }) => {
  if (!agent) return null;
  const proj = PROJECTS.find(p => p.id === agent.project);
  const flagged = agent.state === 'flagged';
  return (
    <div style={{
      background: 'var(--bg-elev-1)',
      border: '1px solid var(--line)',
      borderLeft: `3px solid ${flagged ? 'var(--err)' : 'var(--accent)'}`,
      padding: compact ? 14 : 18,
      fontFamily: 'var(--font-sans)',
      color: 'var(--fg)',
      width: '100%', boxSizing: 'border-box',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: compact ? 20 : 26, letterSpacing: '-0.02em', lineHeight: 1,
            color: 'var(--fg)',
          }}>{agent.name}</div>
          <div style={{
            marginTop: 6,
            fontFamily: 'var(--font-mono)', fontSize: 10,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'var(--fg-faint)',
          }}>{proj?.label}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-faint)', letterSpacing: '0.16em' }}>
            {agent.lastSeen}
          </div>
          <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Badge tone={flagged ? 'err' : 'ok'} sym={flagged ? '!' : '●'}>
              {flagged ? 'FLAGGED' : 'ACTIVE'}
            </Badge>
          </div>
          <div style={{
            marginTop: 6, fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: 13, color: flagged ? 'var(--err)' : 'var(--ok)',
          }}>{agent.mood}</div>
        </div>
      </div>

      {/* Role blurb */}
      <p style={{
        marginTop: 12, marginBottom: 0,
        fontStyle: 'italic', fontSize: 13.5, color: 'var(--fg-muted)', lineHeight: 1.4,
      }}>{agent.blurb}</p>

      {/* L1-L5 levels */}
      <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {LEVELS.map(l => (
          <span key={l.id} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontFamily: 'var(--font-mono)', fontSize: 9.5,
            letterSpacing: '0.14em',
            padding: '3px 6px',
            background: 'var(--bg-elev-2)', color: 'var(--fg-muted)',
            border: '1px solid var(--line-loud)', borderRadius: 2,
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: `var(--${l.tone})`,
              display: 'inline-block',
            }} />
            {l.id}
          </span>
        ))}
      </div>

      {/* Flag row */}
      {agent.flag && (
        <div style={{
          marginTop: 12, padding: '8px 10px',
          background: 'color-mix(in oklch, var(--err) 8%, transparent)',
          borderLeft: '2px solid var(--err)',
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--err)', letterSpacing: '0.04em',
        }}>
          <span style={{ marginRight: 8, fontWeight: 700 }}>!</span>
          {agent.flag}
        </div>
      )}

      {/* Session summary */}
      {!compact && agent.session && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'var(--fg-faint)', marginBottom: 4,
          }}>SESSION · SUMMARY</div>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.5 }}>
            {agent.session}
          </p>
        </div>
      )}
    </div>
  );
};

Object.assign(window, {
  // Scaffolding for old explorations:
  DOMAINS, GRAPH_PROJECTS, ACTIVITY,
  // Shared atoms used by HomeMain + PortfolioMain:
  AgentCard, NavStrip, SectionHeader, ContactRow, Footer, Mascot, TopNav,
});
