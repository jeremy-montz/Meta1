// PortfolioMain.jsx — the recruiter-facing portfolio landing.
// 90% lab coat: lab theme, professional, scannable. A small dash of
// monster (one Pirata flourish, one Caveat margin scribble, candle accents
// on eyebrows) keeps it consistent with the homepage but never theatrical.

const PortfolioMain = () => {
  return (
    <div className="home-shell home-page bg-grid">
      <TopNav active="PORTFOLIO" />
      <PortfolioHero />
      <PortfolioMatrix />
      <LabSnapshot />
      <PortfolioAbout />
      <Footer />
    </div>
  );
};

// ── HERO ───────────────────────────────────────────────────────────────────
const PortfolioHero = () => (
  <div style={{ padding: '64px 40px 48px' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 56, alignItems: 'flex-end' }}>
      <div>
        <Eyebrow color="var(--candle)">// PORTFOLIO · 04 / 2026</Eyebrow>

        <h1 style={{
          marginTop: 14, marginBottom: 18,
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 76, lineHeight: 0.98, letterSpacing: '-0.025em',
          fontVariationSettings: '"opsz" 144',
          maxWidth: 760,
        }}>
          Selected work, <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>shown plainly</span>.
        </h1>

        <p style={{ maxWidth: 620, fontSize: 17, lineHeight: 1.5 }}>
          Senior PM with twelve years of shipping product. Currently running
          Claudemonzter — a small operator-plus-agents lab — to learn AI by
          plugging it into a working system and writing about what happens.
        </p>

        <p style={{ marginTop: 8, maxWidth: 620, fontSize: 14, color: 'var(--fg-subtle)' }}>
          This page is the short version. The longer version is the lab itself —{' '}
          <a href="index.html" style={{ color: 'var(--accent)', borderBottom: '1px solid currentColor' }}>see the graph</a>.
        </p>

        <div style={{ marginTop: 28, display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href={`https://${ME.github}`} style={{ textDecoration: 'none' }}>
            <Button variant="primary">▸ GITHUB</Button>
          </a>
          <a href={`https://${ME.linkedin}`} style={{ textDecoration: 'none' }}>
            <Button variant="secondary">LINKEDIN →</Button>
          </a>
          <span style={{ marginLeft: 8, fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.14em', color: 'var(--fg-subtle)' }}>
            {ME.location.toUpperCase()} · {ME.tagline}
          </span>
        </div>
      </div>

      {/* Right-side spec card */}
      <div style={{
        border: '1px solid var(--line)', background: 'var(--bg-elev-1)',
        padding: 22, fontFamily: 'var(--font-mono)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <Tick>// SPEC</Tick>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ok)', fontSize: 11, letterSpacing: '0.16em' }}>
            <StatusDot tone="ok" glow /> {SPEC.badge}
          </span>
        </div>
        {SPEC.rows.map(([k, v]) => (
          <div key={k} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '8px 0', borderBottom: '1px solid var(--line-soft)',
            fontSize: 11, letterSpacing: '0.14em',
          }}>
            <span style={{ color: 'var(--fg-subtle)' }}>{k}</span>
            <span style={{ color: 'var(--fg)' }}>{v}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Hyde flourish — one line, tucked low */}
    <div style={{
      marginTop: 40, paddingTop: 32, borderTop: '1px dashed var(--line-loud)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span style={{
        fontFamily: 'var(--font-hyde)', fontSize: 22,
        color: 'var(--candle)', letterSpacing: '0.02em',
      }}>
        Hark — &nbsp;<span style={{ color: 'var(--fg-subtle)', fontFamily: 'var(--font-sans)', fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase' }}>{PORTFOLIO.length} PROJECTS BELOW · EVEN THE EMPTY PLINTHS ARE INTENTIONAL.</span>
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>
        ↓ SCROLL
      </span>
    </div>
  </div>
);

// ── PORTFOLIO MATRIX ──────────────────────────────────────────────────────
// Project-shaped slots, expanded view. Real entry shows full detail; planned
// slots are kept as restrained placeholders.
const PortfolioMatrix = () => {
  // Portfolio data now lives in data.js (PORTFOLIO array). The homepage teaser
  // and this expanded view both read the same source; this page uses the
  // optional `details` and `excerpt` fields that the teaser ignores.
  const liveCt = PORTFOLIO.filter(p => p.tone !== 'na').length;

  return (
    <section style={{ padding: '24px 40px 56px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <Eyebrow color="var(--candle)">// 01 · THE WORK</Eyebrow>
          <h2 style={{ marginTop: 8 }}>Portfolio projects.</h2>
          <p style={{ marginTop: 8, maxWidth: 580 }}>
            {liveCt} active, {PORTFOLIO.length - liveCt} on deck. Each entry links to a full write-up or a working artifact.
          </p>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>
          {String(liveCt).padStart(2, '0')} / {String(PORTFOLIO.length).padStart(2, '0')} ACTIVE
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {PORTFOLIO.map((p, i) => <ProjectRow key={p.no} p={p} first={i === 0} last={i === PORTFOLIO.length - 1} />)}
      </div>
    </section>
  );
};

const ProjectRow = ({ p, first, last }) => {
  const live = p.tone !== 'na';
  return (
    <a href={p.href} style={{
      display: 'grid', gridTemplateColumns: '80px 1fr 320px',
      gap: 32, padding: '36px 0',
      borderTop: first ? '1px solid var(--line)' : (live ? '1px solid var(--line)' : '1px dashed var(--line-loud)'),
      borderBottom: last ? '1px solid var(--line)' : 'none',
      transition: 'background 200ms var(--ease-out)',
    }}
    onMouseEnter={e => { if (live) e.currentTarget.style.background = 'color-mix(in oklch, var(--accent) 4%, transparent)'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
      <div>
        <div style={{
          fontFamily: 'var(--font-display)', fontStyle: 'italic',
          fontWeight: 400, fontSize: 56,
          fontVariationSettings: '"opsz" 96',
          color: live ? 'var(--candle)' : 'var(--fg-faint)', lineHeight: 1,
        }}>{p.no}</div>
        <div style={{ marginTop: 8 }}>
          <Badge tone={live ? (p.tone === 'warn' ? 'warn' : 'ok') : 'neutral'} sym={live ? '▲' : '—'}>{p.status}</Badge>
        </div>
      </div>

      <div>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontWeight: 600,
          fontSize: 44, letterSpacing: '-0.02em', lineHeight: 1.05,
          color: live ? 'var(--fg)' : 'var(--fg-subtle)',
          margin: 0, marginBottom: 12,
        }}>{p.title}<span style={{ color: 'var(--accent)' }}>{live ? '.' : ''}</span></h3>
        <div style={{ marginBottom: 14 }}>
          <Badge tone={live ? 'accent' : 'neutral'}>{p.tag}</Badge>
        </div>
        <p style={{ fontSize: 16, lineHeight: 1.5, maxWidth: 560, marginBottom: p.excerpt ? 16 : 0 }}>{p.blurb}</p>
        {p.excerpt && (
          <p style={{
            marginTop: 12, paddingLeft: 16,
            borderLeft: '2px solid var(--candle)',
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: 16, color: 'var(--fg-muted)', maxWidth: 560,
            fontVariationSettings: '"opsz" 36, "SOFT" 100', lineHeight: 1.45,
          }}>{p.excerpt}</p>
        )}
      </div>

      {p.details && (
        <div>
          <Tick>// SPECS</Tick>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column' }}>
            {p.details.map(([k, v]) => (
              <div key={k} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '8px 0', borderBottom: '1px solid var(--line-soft)',
                fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em',
              }}>
                <span style={{ color: 'var(--fg-subtle)' }}>{k}</span>
                <span style={{ color: live ? 'var(--fg)' : 'var(--fg-faint)' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
          }}>
            <span style={{ color: live ? 'var(--accent)' : 'var(--fg-faint)' }}>
              {live ? '▸ READ' : 'COMING SOON'}
            </span>
            <span style={{ color: 'var(--fg-faint)' }}>{live ? '↗' : ''}</span>
          </div>
        </div>
      )}
    </a>
  );
};

// ── LAB SNAPSHOT ──────────────────────────────────────────────────────────
// Compact summary of the live lab graph as a "what's running underneath"
// readout. Reinforces the connection between this page and the homepage.
const LabSnapshot = () => (
  <section style={{ padding: '24px 40px 56px', borderTop: '1px dashed var(--line-loud)' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'flex-start', paddingTop: 32 }}>
      <div>
        <Eyebrow color="var(--candle)">// 02 · THE LAB</Eyebrow>
        <h2 style={{ marginTop: 8, marginBottom: 14 }}>What I'm actually running.</h2>
        <p style={{ fontSize: 15.5, lineHeight: 1.55, marginBottom: 14, maxWidth: 540 }}>
          Claudemonzter is a working multi-agent system. Four projects, eight named agents, one operator (me). Each agent has a role, a mood, a level set, and a session log — and each writes back to a shared canon.
        </p>
        <p style={{ fontSize: 14, color: 'var(--fg-subtle)', lineHeight: 1.55, marginBottom: 22, maxWidth: 540 }}>
          The point isn't to demo agents. The point is to operate them — to find out what falls out when you do.
        </p>
        <a href="dashboard.html" style={{ textDecoration: 'none' }}>
          <Button variant="primary">▸ OPEN AGENT STATUS</Button>
        </a>
        <a href="index.html" style={{ textDecoration: 'none', marginLeft: 12 }}>
          <Button variant="secondary">SEE THE GRAPH →</Button>
        </a>
      </div>

      <div>
        <Tick>// LIVE READOUT</Tick>
        <div style={{ marginTop: 12, border: '1px solid var(--line)', background: 'var(--bg-elev-1)' }}>
          {PROJECTS.map(proj => {
            const projectAgents = AGENTS.filter(a => a.project === proj.id);
            const toneColor = {
              accent: 'var(--accent)', info: 'var(--info)', ok: 'var(--ok)', warn: 'var(--warn)',
            }[proj.tone];
            return (
              <div key={proj.id} style={{
                padding: '14px 16px',
                borderBottom: '1px solid var(--line-soft)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
                    letterSpacing: '0.18em', color: toneColor,
                  }}>{proj.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--fg-faint)' }}>
                    {projectAgents.length} AGENT{projectAgents.length === 1 ? '' : 'S'}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 8 }}>{proj.blurb}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {projectAgents.map(a => (
                    <span key={a.id} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '4px 8px', border: '1px solid var(--line-loud)',
                      fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.12em',
                      color: a.state === 'flagged' ? 'var(--err)' : 'var(--fg-muted)',
                    }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: a.state === 'flagged' ? 'var(--err)' : 'var(--ok)',
                      }} />
                      {a.name.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="scribble" style={{
          display: 'inline-block', marginTop: 14,
          color: 'var(--fg-muted)', fontSize: 20,
        }}>
          (every name above has a page · hover the graph on the home page)
        </div>
      </div>
    </div>
  </section>
);

// ── ABOUT + CONTACT ──────────────────────────────────────────────────────
const PortfolioAbout = () => (
  <section id="about" style={{ padding: '48px 40px 56px', borderTop: '1px solid var(--line)' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 48, alignItems: 'flex-start' }}>
      <div>
        <Eyebrow color="var(--candle)">// 03 · ABOUT</Eyebrow>
        <h2 style={{ marginTop: 10, marginBottom: 18 }}>The operator.</h2>
        <p style={{ fontSize: 17, lineHeight: 1.55, marginBottom: 14 }}>
          I'm Jeremy Montz — senior product manager and product owner. I've spent my career building B2B tools with software engineers: SaaS and on-prem, data enrichment and visualization, eDiscovery. The through-line is systems thinking — how the pieces connect matters more than any single piece.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--fg-muted)' }}>
          Right now I'm building Claudemonzter — a working multi-agent system where I'm testing my instincts with AI agents as collaborators instead of human engineers. What you see is the result of building something entirely on my own, and finding out the hard way what works and what doesn't. If you're hiring for a senior or principal PM seat on something AI-native, I want to talk.
        </p>
      </div>
      <div style={{ border: '1px solid var(--line)', background: 'var(--bg-elev-1)', padding: 20 }}>
        <Eyebrow color="var(--candle)">// REACH</Eyebrow>
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a href={`https://${ME.github}`} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 12px', border: '1px solid var(--line-loud)',
            fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.14em',
          }}>
            <span><span style={{ color: 'var(--accent)' }}>↗ </span>GITHUB</span>
            <span style={{ color: 'var(--fg-subtle)' }}>@JeremyMontz</span>
          </a>
          <a href={`https://${ME.linkedin}`} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 12px', border: '1px solid var(--line-loud)',
            fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.14em',
          }}>
            <span><span style={{ color: 'var(--accent)' }}>↗ </span>LINKEDIN</span>
            <span style={{ color: 'var(--fg-subtle)' }}>/{ME.linkedin.split('/').pop()}</span>
          </a>
          <a href="index.html" style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 12px', border: '1px solid color-mix(in oklch, var(--accent) 40%, transparent)',
            background: 'var(--accent-low)',
            fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.14em', color: 'var(--accent)',
          }}>
            <span>▸ THE LAB</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </div>
  </section>
);

window.PortfolioMain = PortfolioMain;
