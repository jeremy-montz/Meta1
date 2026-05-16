// AgentGraph.jsx — the homepage centerpiece.
// SVG node graph: center = the lab, inner ring = 4 projects, outer ring =
// 8 agents grouped around their parent. Hover dims non-connected paths;
// the right-hand <Inspector> swaps to the matching AgentCard.

// Hardcoded positions. ViewBox 1000×640. Tuned by eye for legibility,
// with enough top/side padding for labels.
const W = 1000, H = 640;
const CX = W / 2, CY = H / 2 + 10;

const POSITIONS = {
  // center
  'me':         { x: CX,        y: CY,         kind: 'hub'     },

  // projects (inner ring) — four cardinal positions
  'meta1':      { x: CX,        y: CY - 150,   kind: 'project' },
  'pura-vida':  { x: CX + 175,  y: CY + 45,    kind: 'project' },
  'phil':       { x: CX - 10,   y: CY + 175,   kind: 'project' },
  'self':       { x: CX - 200,  y: CY - 10,    kind: 'project' },

  // agents (outer ring) — clustered around their parent project,
  // with enough top/side margin that labels fit below every node.
  // meta1 cluster (top)
  'a-meta1':    { x: CX - 105,  y: CY - 240,   kind: 'agent', projectId: 'meta1' },
  'a-bond':     { x: CX + 100,  y: CY - 250,   kind: 'agent', projectId: 'meta1' },
  // pura-vida cluster (right)
  'a-house':    { x: CX + 320,  y: CY - 80,    kind: 'agent', projectId: 'pura-vida' },
  'a-freedom':  { x: CX + 365,  y: CY + 50,    kind: 'agent', projectId: 'pura-vida' },
  'a-evolve':   { x: CX + 345,  y: CY + 160,   kind: 'agent', projectId: 'pura-vida' },
  'a-assessor': { x: CX + 240,  y: CY + 240,   kind: 'agent', projectId: 'pura-vida' },
  // phil cluster (bottom)
  'a-phil':     { x: CX - 100,  y: CY + 245,   kind: 'agent', projectId: 'phil' },
  // self cluster (left)
  'a-jeremy':   { x: CX - 380,  y: CY - 60,    kind: 'agent', projectId: 'self' },
};

const AGENT_NODE_ID = (a) => 'a-' + a.id;

const AgentGraph = ({ hovered, setHovered, agents: agentsProp, fetchStatus }) => {
  // Use live agents if provided, fall back to static global
  const agents = agentsProp || AGENTS;

  // Compute connectivity. When hovering an agent, only its agent→project→hub
  // path is lit. When hovering a project, all its agents + the hub. When
  // hovering the hub, everything.
  const litIds = React.useMemo(() => {
    if (!hovered) return new Set();
    const lit = new Set([hovered.id]);
    if (hovered.kind === 'hub') {
      PROJECTS.forEach(p => lit.add(p.id));
      agents.forEach(a => lit.add(AGENT_NODE_ID(a)));
    } else if (hovered.kind === 'project') {
      lit.add('me');
      agents.filter(a => a.project === hovered.id).forEach(a => lit.add(AGENT_NODE_ID(a)));
    } else if (hovered.kind === 'agent') {
      const agent = agents.find(a => AGENT_NODE_ID(a) === hovered.id);
      if (agent) {
        lit.add(agent.project);
        lit.add('me');
      }
    }
    return lit;
  }, [hovered, agents]);

  // Build edges: hub↔project, project↔its agents.
  const edges = [];
  PROJECTS.forEach(p => {
    edges.push({ a: 'me', b: p.id, key: 'me-' + p.id });
    agents.filter(a => a.project === p.id).forEach(ag => {
      edges.push({ a: p.id, b: AGENT_NODE_ID(ag), key: p.id + '-' + ag.id });
    });
  });

  const edgeLit = (e) => hovered && litIds.has(e.a) && litIds.has(e.b);
  const edgeFaded = (e) => hovered && !edgeLit(e);
  const nodeFaded = (id) => hovered && !litIds.has(id);

  return (
    <div style={{
      position: 'relative',
      border: '1px solid var(--line)',
      background: 'var(--bg-elev-1)',
      aspectRatio: '1000 / 640',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      {/* Top-left readout */}
      <div style={{
        position: 'absolute', top: 14, left: 16,
        fontFamily: 'var(--font-mono)', fontSize: 10,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'var(--fg-faint)', pointerEvents: 'none', zIndex: 1,
      }}>
        {'// GRAPH · CLAUDEMONZTER · ' + (SITE ? SITE.version : 'v3.3')}
      </div>
      <div style={{
        position: 'absolute', top: 14, right: 16,
        fontFamily: 'var(--font-mono)', fontSize: 10,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'var(--fg-faint)', pointerEvents: 'none', zIndex: 1,
      }}>
        4 PROJECTS · 8 AGENTS · 1 OPERATOR
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ display: 'block' }}>
        {/* Edges */}
        {edges.map(e => {
          const A = POSITIONS[e.a], B = POSITIONS[e.b];
          if (!A || !B) return null;
          return (
            <line key={e.key}
                  x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                  stroke={edgeLit(e) ? 'var(--accent)' : 'var(--line-loud)'}
                  strokeWidth={edgeLit(e) ? 1.5 : 1}
                  opacity={edgeFaded(e) ? 0.25 : 0.85} />
          );
        })}

        {/* HUB ─ Claudemonzter */}
        <HubNode hovered={hovered} setHovered={setHovered} faded={nodeFaded('me')} />

        {/* PROJECT NODES */}
        {PROJECTS.map(p => (
          <ProjectNode key={p.id} project={p}
                       hovered={hovered} setHovered={setHovered}
                       faded={nodeFaded(p.id)} />
        ))}

        {/* AGENT NODES */}
        {agents.map(a => (
          <AgentNode key={a.id} agent={a}
                     hovered={hovered} setHovered={setHovered}
                     faded={nodeFaded(AGENT_NODE_ID(a))} />
        ))}
      </svg>

      {/* Helper hint when nothing is hovered */}
      {!hovered && (
        <div style={{
          position: 'absolute', bottom: 14, left: 16,
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--fg-faint)',
          display: 'inline-flex', alignItems: 'center', gap: 8,
        }}>
          <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', color: 'var(--accent)' }} />
          HOVER ANY NODE TO INSPECT →
        </div>
      )}
    </div>
  );
};

// ── HUB ────────────────────────────────────────────────────────────────────
const HubNode = ({ hovered, setHovered, faded }) => {
  const active = hovered?.id === 'me';
  return (
    <g
      onMouseEnter={() => setHovered({ id: 'me', kind: 'hub' })}
      onMouseLeave={() => setHovered(null)}
      onClick={() => window.location.href = 'dashboard.html'}
      style={{ cursor: 'pointer', opacity: faded ? 0.4 : 1, transition: 'opacity 200ms var(--ease-out)' }}>
      <circle cx={CX} cy={CY} r="58" fill="var(--accent-low)" stroke="var(--accent)" strokeWidth={active ? 2.5 : 1.5} />
      <circle cx={CX} cy={CY} r="58" fill="none" stroke="var(--accent-glow)" strokeWidth="8" opacity="0.45" />
      {/* Bolt glyph inside */}
      <path
        d="M -6 -22 L 16 -22 L 4 -2 L 14 -2 L -6 22 L 4 4 L -8 4 Z"
        transform={`translate(${CX} ${CY - 14}) scale(0.85)`}
        fill="var(--accent)" />
      <text x={CX} y={CY + 24} textAnchor="middle"
            fontFamily="var(--font-mono)" fontSize="11" fontWeight="600"
            letterSpacing="2.5" fill="var(--accent)"
            style={{ textTransform: 'uppercase', pointerEvents: 'none' }}>
        CLAUDEMONZTER
      </text>
    </g>
  );
};

// ── PROJECT ────────────────────────────────────────────────────────────────
const ProjectNode = ({ project, hovered, setHovered, faded }) => {
  const pos = POSITIONS[project.id];
  const active = hovered?.id === project.id;
  // Per-project tone → ring color
  const toneColor = {
    accent: 'var(--accent)',
    info:   'var(--info)',
    ok:     'var(--ok)',
    warn:   'var(--warn)',
  }[project.tone] || 'var(--accent)';

  return (
    <g
      onMouseEnter={() => setHovered({ id: project.id, kind: 'project' })}
      onMouseLeave={() => setHovered(null)}
      onClick={() => {
        const dest = project.id === 'meta1' ? 'agents/meta1/meta1.html' :
                     project.id === 'pura-vida' ? 'agents/house/house.html' :
                     project.id === 'phil' ? '#' : '#';
        if (dest !== '#') window.location.href = dest;
      }}
      style={{ cursor: 'pointer', opacity: faded ? 0.35 : 1, transition: 'opacity 200ms var(--ease-out)' }}>
      <circle cx={pos.x} cy={pos.y} r="34"
              fill="var(--bg-elev-2)"
              stroke={toneColor}
              strokeWidth={active ? 2.5 : 1.5} />
      {active && <circle cx={pos.x} cy={pos.y} r="34" fill="none" stroke={toneColor} strokeWidth="6" opacity="0.35" />}
      <text x={pos.x} y={pos.y + 4} textAnchor="middle"
            fontFamily="var(--font-mono)" fontSize="10" fontWeight="600"
            letterSpacing="1.8" fill={toneColor}
            style={{ textTransform: 'uppercase', pointerEvents: 'none' }}>
        {project.label}
      </text>
    </g>
  );
};

// ── AGENT ──────────────────────────────────────────────────────────────────
const AgentNode = ({ agent, hovered, setHovered, faded }) => {
  const id = AGENT_NODE_ID(agent);
  const pos = POSITIONS[id];
  const active = hovered?.id === id;
  const flagged = agent.state === 'flagged';
  const idle = agent.state === 'idle';
  const ringColor = flagged ? 'var(--err)' : idle ? 'var(--fg-subtle)' : 'var(--ok)';

  // Labels always sit below the node — the cluster layout above gives
  // every outer agent enough vertical room.
  return (
    <g
      onMouseEnter={() => setHovered({ id, kind: 'agent' })}
      onMouseLeave={() => setHovered(null)}
      onClick={() => window.location.href = `agents/${agent.id}/${agent.id}.html`}
      style={{ cursor: 'pointer', opacity: faded ? 0.3 : 1, transition: 'opacity 200ms var(--ease-out)' }}>
      <circle cx={pos.x} cy={pos.y} r={active ? 18 : 14}
              fill="var(--bg-elev-2)"
              stroke={ringColor}
              strokeWidth={active ? 2 : 1.25} />
      {flagged && (
        <circle cx={pos.x} cy={pos.y} r={5} fill="var(--err)"
                className="pulse-dot" style={{ color: 'var(--err)' }} />
      )}
      {!flagged && !idle && active && (
        <circle cx={pos.x} cy={pos.y} r={4} fill="var(--ok)" />
      )}
      <text x={pos.x}
            y={pos.y + 32}
            textAnchor="middle"
            fontFamily="var(--font-mono)" fontSize="10" fontWeight={active ? 600 : 400}
            letterSpacing="1.5"
            fill={active ? 'var(--fg)' : 'var(--fg-muted)'}
            style={{ textTransform: 'uppercase', pointerEvents: 'none' }}>
        {agent.name}
      </text>
    </g>
  );
};

// ── INSPECTOR PANE ─────────────────────────────────────────────────────────
const Inspector = ({ hovered, agent, agents: agentsProp, fetchStatus }) => {
  const agents = agentsProp || AGENTS;
  // STATE A: empty / instructions
  if (!hovered) {
    return (
      <div style={{
        border: '1px solid var(--line)', background: 'var(--bg-elev-1)',
        padding: 24, display: 'flex', flexDirection: 'column', gap: 18,
        height: '100%', boxSizing: 'border-box', overflow: 'auto',
      }}>
        <Eyebrow color="var(--candle)">// INSPECTOR · IDLE</Eyebrow>
        <h3 style={{ marginTop: 4 }}>
          Hover a node.
        </h3>
        <p style={{ color: 'var(--fg-subtle)' }}>
          The center is Claudemonzter itself. The four inner orbs are projects.
          The eight outer dots are agents — each one a live entity with its own
          mood, level set, and session log.
        </p>

        <div style={{ marginTop: 10, borderTop: '1px dashed var(--line-loud)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Eyebrow color="var(--candle)">// LEGEND</Eyebrow>
          {[
            { c: 'var(--accent)', label: 'CLAUDEMONZTER · the lab' },
            { c: 'var(--info)',   label: 'PROJECT · namespace' },
            { c: 'var(--ok)',     label: 'AGENT · active' },
            { c: 'var(--err)',    label: 'AGENT · flagged' },
          ].map(row => (
            <div key={row.label} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em',
              color: 'var(--fg-muted)',
            }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', border: `1.5px solid ${row.c}`, display: 'inline-block' }} />
              {row.label}
            </div>
          ))}
        </div>

        <div className="scribble" style={{
          marginTop: 'auto', color: 'var(--candle)', fontSize: 22, display: 'block',
        }}>
          click any node → <br/>enter its page.
        </div>
      </div>
    );
  }

  // STATE B: hovered hub
  if (hovered.kind === 'hub') {
    return (
      <div style={{ border: '1px solid var(--line)', background: 'var(--bg-elev-1)', padding: 24, height: '100%', boxSizing: 'border-box', overflow: 'auto' }}>
        <Eyebrow color="var(--candle)">// INSPECTOR · LAB</Eyebrow>
        <h2 style={{ marginTop: 10, marginBottom: 14 }}>
          <span className="t-hyde" style={{ fontSize: 38, color: 'var(--accent)' }}>Claudemon</span>
          <span className="t-hyde" style={{ fontSize: 38, color: 'var(--accent)' }}>z</span>
          <span className="t-hyde" style={{ fontSize: 38, color: 'var(--accent)' }}>ter.</span>
        </h2>
        <p style={{ marginBottom: 16 }}>
          {ME.blurb}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['EST.',     ME.est.replace('EST. ', '')],
            ['VERSION',  SITE.version],
            ['LAB',      '001 · ' + SITE.status],
            ['PROJECTS', PROJECTS.length + ' ACTIVE'],
            ['AGENTS',   agents.length + ' TRACKED'],
          ].map(([k, v]) => (
            <div key={k} style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em',
              padding: '6px 0', borderBottom: '1px solid var(--line-soft)',
            }}>
              <span style={{ color: 'var(--fg-subtle)' }}>{k}</span>
              <span style={{ color: 'var(--fg)' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18 }}>
          <a href="dashboard.html" style={{ textDecoration: 'none' }}>
            <Button variant="primary">▸ OPEN AGENT STATUS</Button>
          </a>
        </div>
      </div>
    );
  }

  // STATE C: hovered project
  if (hovered.kind === 'project') {
    const project = PROJECTS.find(p => p.id === hovered.id);
    const projectAgents = agents.filter(a => a.project === project.id);
    const toneColor = {
      accent: 'var(--accent)', info: 'var(--info)', ok: 'var(--ok)', warn: 'var(--warn)',
    }[project.tone];
    return (
      <div style={{ border: '1px solid var(--line)', background: 'var(--bg-elev-1)', padding: 24, height: '100%', boxSizing: 'border-box', overflow: 'auto' }}>
        <Eyebrow color="var(--candle)">// INSPECTOR · PROJECT</Eyebrow>
        <h2 style={{
          marginTop: 10, marginBottom: 8, color: toneColor,
          fontFamily: 'var(--font-display)', fontStyle: 'italic',
        }}>{project.label}</h2>
        <p style={{ marginBottom: 18 }}>{project.blurb}</p>

        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--fg-faint)', marginBottom: 8,
        }}>
          {projectAgents.length} AGENT{projectAgents.length === 1 ? '' : 'S'} IN THIS PROJECT
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {projectAgents.map(a => (
            <div key={a.id} style={{
              padding: '10px 12px',
              border: '1px solid var(--line)',
              background: 'var(--bg-elev-2)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16 }}>{a.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--fg-faint)', textTransform: 'uppercase' }}>
                  {a.role}
                </div>
              </div>
              <Badge tone={a.state === 'flagged' ? 'err' : a.state === 'idle' ? 'neutral' : 'ok'}
                     sym={a.state === 'flagged' ? '!' : '●'}>
                {(a.state || 'active').toUpperCase()}
              </Badge>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18 }}>
          <a href={project.id === 'meta1' ? 'agents/meta1/meta1.html' :
                   project.id === 'pura-vida' ? 'agents/house/house.html' :
                   project.id === 'phil' ? '#' :
                   '#'} style={{ textDecoration: 'none' }}>
            <Button variant="secondary">OPEN {project.label} →</Button>
          </a>
        </div>
      </div>
    );
  }

  // STATE D: hovered agent — full AgentCard
  if (!agent) return null; // safety: if the prop didn't resolve, render nothing
  return (
    <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <AgentCard agent={agent} />
      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>
          AGENT ID · {agent.id}
        </span>
        <a href={`agents/${agent.id}/${agent.id}.html`} style={{ textDecoration: 'none' }}>
          <Button variant="secondary">OPEN AGENT →</Button>
        </a>
      </div>
    </div>
  );
};

window.AgentGraph = AgentGraph;
window.Inspector = Inspector;
