// Primitives.jsx — small reusable atoms
const Eyebrow = ({ children, color }) => (
  <div style={{
    fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500,
    letterSpacing: '0.28em', textTransform: 'uppercase',
    color: color || 'var(--accent)',
  }}>{children}</div>
);

const Tick = ({ children }) => (
  <span style={{
    fontFamily: 'var(--font-mono)', fontSize: 10,
    letterSpacing: '0.16em', textTransform: 'uppercase',
    color: 'var(--fg-subtle)',
  }}>{children}</span>
);

const Badge = ({ tone = 'neutral', children, sym }) => {
  const tones = {
    neutral: { c: 'var(--fg-muted)',  b: 'var(--line-loud)' },
    accent:  { c: 'var(--accent)',    b: 'color-mix(in oklch, var(--accent) 40%, transparent)' },
    ok:      { c: 'var(--ok)',        b: 'color-mix(in oklch, var(--ok) 40%, transparent)' },
    warn:    { c: 'var(--warn)',      b: 'color-mix(in oklch, var(--warn) 40%, transparent)' },
    err:     { c: 'var(--err)',       b: 'color-mix(in oklch, var(--err) 40%, transparent)' },
    info:    { c: 'var(--info)',      b: 'color-mix(in oklch, var(--info) 40%, transparent)' },
    party:   { c: 'var(--party)',     b: 'color-mix(in oklch, var(--party) 40%, transparent)' },
  }[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      padding: '2px 8px', border: `1px solid ${tones.b}`, borderRadius: 2,
      color: tones.c, background: 'var(--bg-elev-1)',
    }}>
      {sym && <span>{sym}</span>}
      {children}
    </span>
  );
};

const Button = ({ variant = 'primary', children, onClick, disabled }) => {
  const base = {
    fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
    letterSpacing: '0.14em', textTransform: 'uppercase',
    padding: '10px 18px', borderRadius: 2, cursor: disabled ? 'not-allowed' : 'pointer',
    border: '1px solid transparent', transition: 'all 160ms var(--ease-out)',
  };
  const variants = {
    primary:   { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' },
    secondary: { background: 'transparent',   color: 'var(--fg)', borderColor: 'var(--line-loud)' },
    ghost:     { background: 'transparent',   color: 'var(--fg-muted)', borderColor: 'transparent', padding: '10px 14px' },
    destructive:{background: 'var(--err)',    color: 'var(--bg)', borderColor: 'var(--err)' },
  };
  return (
    <button style={{ ...base, ...variants[variant], opacity: disabled ? 0.4 : 1 }}
            disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

const Hairline = ({ dashed, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0' }}>
    <div style={{ flex: 1, borderTop: `1px ${dashed ? 'dashed' : 'solid'} var(--line)` }} />
    {label && <Tick>{label}</Tick>}
    <div style={{ flex: 1, borderTop: `1px ${dashed ? 'dashed' : 'solid'} var(--line)` }} />
  </div>
);

const StatusDot = ({ tone = 'ok', glow }) => {
  const c = { ok: 'var(--ok)', warn: 'var(--warn)', err: 'var(--err)', na: 'var(--fg-faint)', accent: 'var(--accent)' }[tone];
  return (
    <span style={{
      display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
      background: c, boxShadow: glow ? `0 0 8px ${c}` : 'none', flexShrink: 0,
    }} />
  );
};

const Input = (props) => (
  <input {...props} style={{
    fontFamily: 'var(--font-mono)', fontSize: 13,
    background: 'var(--bg-elev-1)', color: 'var(--fg)',
    border: '1px solid var(--line-loud)', padding: '10px 12px',
    borderRadius: 2, letterSpacing: '0.08em', outline: 'none',
    width: '100%', boxSizing: 'border-box',
    ...(props.style || {}),
  }}/>
);

const Card = ({ children, glow, elev = 1, style }) => (
  <div style={{
    background: elev === 2 ? 'var(--bg-elev-2)' : 'var(--bg-elev-1)',
    border: `1px solid ${glow ? 'color-mix(in oklch, var(--accent) 40%, transparent)' : 'var(--line)'}`,
    boxShadow: glow ? '0 0 24px -4px color-mix(in oklch, var(--accent) 40%, transparent)' : 'none',
    padding: 18, position: 'relative',
    ...(style || {}),
  }}>{children}</div>
);

Object.assign(window, { Eyebrow, Tick, Badge, Button, Hairline, StatusDot, Input, Card });
