// Wordmark.jsx — inline HTML wordmark. The 'z' in monzter is rendered as a lightning bolt.
const BoltZ = ({ size = 42, color = 'var(--accent)' }) => {
  // Sized to match the visual weight of a Fraunces 900 lowercase letter.
  // Height ~ 0.72em (x-height + small descent slack), width ~ 0.55em.
  const h = size * 0.72;
  const w = size * 0.56;
  return (
    <svg
      width={w} height={h} viewBox="0 0 56 72"
      style={{ display: 'inline-block', verticalAlign: 'baseline', marginBottom: `-${size * 0.02}px` }}
      aria-label="z"
    >
      {/* Bolt that reads as a letter 'z': top-left to bottom-right jag */}
      <path d="M 6 2 L 50 2 L 30 32 L 48 32 L 8 70 L 26 40 L 6 40 Z" fill={color}/>
    </svg>
  );
};

const Wordmark = ({ size = 42, tick = true }) => (
  <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 4, lineHeight: 1 }}>
    {tick && (
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.28em',
        color: 'var(--fg-subtle)', textTransform: 'uppercase',
      }}>// EST. 2026 — LAB 001</div>
    )}
    <div style={{
      fontFamily: 'var(--font-display)', fontWeight: 900,
      fontSize: size, letterSpacing: '-0.035em', lineHeight: 1,
      fontVariationSettings: '"opsz" 144',
      display: 'inline-flex', alignItems: 'baseline',
    }}>
      <span style={{ color: 'var(--fg)' }}>Claude</span>
      <span style={{ color: 'var(--accent)' }}>mon</span>
      <BoltZ size={size}/>
      <span style={{ color: 'var(--accent)' }}>ter</span>
    </div>
  </div>
);

window.Wordmark = Wordmark;
window.BoltZ = BoltZ;
