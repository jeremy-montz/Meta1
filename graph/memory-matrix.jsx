// memory/memory-matrix.jsx — the 5×3 matrix with click-to-expand row detail.

const { useState } = React;

// shared utilities -----------------------------------------------------------

const mix = (token, pct, base = 'transparent') =>
  `color-mix(in oklch, ${token} ${pct}%, ${base})`;

const Eyebrow = ({ children, color = 'var(--accent)', size = 10 }) => (
  <div style={{
    fontFamily: 'var(--font-mono)', fontSize: size,
    letterSpacing: '0.28em', textTransform: 'uppercase',
    color,
  }}>{children}</div>
);

const Tag = ({ children, color }) => (
  <span style={{
    display: 'inline-block',
    fontFamily: 'var(--font-mono)', fontSize: 9,
    letterSpacing: '0.14em', textTransform: 'uppercase',
    color: 'var(--fg-muted)',
    padding: '3px 7px',
    border: `1px solid ${mix(color, 35, 'var(--line)')}`,
    background: mix(color, 6, 'var(--bg-elev-1)'),
    marginRight: 4, marginBottom: 4,
  }}>{children}</span>
);

// header row ----------------------------------------------------------------

const HeaderRow = () => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '280px repeat(3, 1fr)',
    gap: 1,
    background: 'var(--line)',
    border: '1px solid var(--line-loud)',
    borderBottom: 'none',
  }}>
    <div style={{
      padding: '12px 14px', background: 'var(--bg-elev-2)',
      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
      letterSpacing: '0.2em', textTransform: 'uppercase',
      color: 'var(--fg-subtle)',
    }}>// layer</div>
    {window.MEMORY_PLATFORMS.map(p => (
      <div key={p.id} style={{
        padding: '12px 14px', background: 'var(--bg-elev-2)',
        display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'var(--fg)',
        }}>{p.label}</div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9,
          letterSpacing: '0.14em', color: 'var(--fg-faint)',
          textTransform: 'uppercase',
        }}>{p.sub}</div>
      </div>
    ))}
  </div>
);

// layer row -----------------------------------------------------------------

const LayerInfo = ({ layer, expanded, isLast }) => (
  <div style={{
    padding: '14px 16px',
    background: mix(layer.tokenColor, 7, 'var(--bg-elev-1)'),
    borderLeft: `3px solid ${layer.tokenColor}`,
    display: 'flex', flexDirection: 'column', gap: 6,
    position: 'relative',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
        letterSpacing: '0.14em',
        color: 'var(--bg)', background: layer.tokenColor,
        padding: '2px 8px', borderRadius: 1,
      }}>L{layer.id}</span>
      <span style={{
        fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600,
        letterSpacing: '-0.01em', color: 'var(--fg)',
        fontVariationSettings: '"opsz" 48', lineHeight: 1,
      }}>{layer.name}</span>
      <span aria-hidden="true" style={{
        marginLeft: 'auto',
        width: 28, height: 28,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 600,
        lineHeight: 1,
        color: expanded ? 'var(--bg)' : layer.tokenColor,
        background: expanded ? layer.tokenColor : mix(layer.tokenColor, 12, 'var(--bg-elev-2)'),
        border: `1px solid ${expanded ? layer.tokenColor : mix(layer.tokenColor, 50, 'var(--line-loud)')}`,
        borderRadius: 2,
        transition: 'background 160ms var(--ease-out), color 160ms var(--ease-out)',
      }}>{expanded ? '−' : '+'}</span>
    </div>
    <div style={{
      fontFamily: 'var(--font-display)', fontStyle: 'italic',
      fontSize: 13, lineHeight: 1.4, color: 'var(--fg-muted)',
      fontVariationSettings: '"opsz" 36',
    }}>{layer.question}</div>
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <Tag color={layer.tokenColor}>{layer.persistence}</Tag>
      <Tag color={layer.tokenColor}>{layer.updateFreq}</Tag>
      <Tag color={layer.tokenColor}>{layer.maxLines}</Tag>
    </div>
  </div>
);

const PlatformCell = ({ layer, platform }) => {
  const data = layer[platform.id];
  const absent = data.absent;
  if (absent) {
    return (
      <div style={{
        padding: '14px 16px', background: 'var(--bg-elev-1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'var(--fg-faint)',
          padding: '6px 14px',
          border: '1px dashed var(--line-loud)',
        }}>· not available ·</span>
      </div>
    );
  }
  return (
    <div style={{
      padding: '14px 16px', background: 'var(--bg-elev-1)',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        color: 'var(--fg)',
      }}>{data.label}</div>
      <code style={{
        fontFamily: 'var(--font-mono)', fontSize: 10,
        color: layer.tokenColor,
        background: mix(layer.tokenColor, 8, 'var(--bg)'),
        padding: '3px 7px',
        border: `1px solid ${mix(layer.tokenColor, 22, 'transparent')}`,
        borderRadius: 1,
        wordBreak: 'break-word', alignSelf: 'flex-start',
        lineHeight: 1.4,
      }}>{data.location}</code>
      <div style={{
        fontFamily: 'var(--font-sans)', fontSize: 11.5, lineHeight: 1.45,
        color: 'var(--fg-muted)',
      }}>{data.howLoaded.split('.')[0]}.</div>
    </div>
  );
};

const Row = ({ layer, expanded, onToggle, isLast }) => (
  <>
    <div
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); }}}
      style={{
        display: 'grid',
        gridTemplateColumns: '280px repeat(3, 1fr)',
        gap: 1,
        background: 'var(--line)',
        borderLeft: '1px solid var(--line-loud)',
        borderRight: '1px solid var(--line-loud)',
        borderBottom: isLast && !expanded ? '1px solid var(--line-loud)' : '1px solid var(--line)',
        cursor: 'pointer',
      }}
      className="memory-row"
    >
      <LayerInfo layer={layer} expanded={expanded} isLast={isLast}/>
      {window.MEMORY_PLATFORMS.map(p => (
        <PlatformCell key={p.id} layer={layer} platform={p}/>
      ))}
    </div>
    {expanded && <DetailPanel layer={layer} isLast={isLast}/>}
  </>
);

// detail panel ---------------------------------------------------------------

const DetailPanel = ({ layer, isLast }) => (
  <div style={{
    background: mix(layer.tokenColor, 4, 'var(--bg-elev-1)'),
    borderLeft: `3px solid ${layer.tokenColor}`,
    borderRight: '1px solid var(--line-loud)',
    borderBottom: isLast ? '1px solid var(--line-loud)' : '1px solid var(--line)',
    padding: '22px 26px',
    animation: 'memory-fade-in 240ms var(--ease-out)',
  }}>
    {/* description */}
    <p style={{
      margin: '0 0 18px',
      fontFamily: 'var(--font-display)', fontStyle: 'italic',
      fontSize: 16, lineHeight: 1.55, color: 'var(--fg)',
      fontVariationSettings: '"opsz" 48',
      maxWidth: 920,
    }}>{layer.description}</p>

    {/* belongs / does not belong */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 18 }}>
      <div>
        <Eyebrow color="var(--ok)" size={9}>// belongs here</Eyebrow>
        <ul style={{
          listStyle: 'none', padding: 0, margin: '8px 0 0',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {layer.whatBelongs.map((item, i) => (
            <li key={i} style={{
              fontFamily: 'var(--font-sans)', fontSize: 12.5, lineHeight: 1.5,
              color: 'var(--fg-muted)',
              borderBottom: '1px solid var(--line-soft)',
              paddingBottom: 4,
            }}>
              <span style={{ color: 'var(--ok)', marginRight: 6,
                             fontFamily: 'var(--font-mono)' }}>●</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Eyebrow color="var(--err)" size={9}>// does not belong</Eyebrow>
        <ul style={{
          listStyle: 'none', padding: 0, margin: '8px 0 0',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {layer.whatDoesNot.map((item, i) => (
            <li key={i} style={{
              fontFamily: 'var(--font-sans)', fontSize: 12.5, lineHeight: 1.5,
              color: 'var(--fg-subtle)',
              borderBottom: '1px solid var(--line-soft)',
              paddingBottom: 4,
            }}>
              <span style={{ color: 'var(--err)', marginRight: 6,
                             fontFamily: 'var(--font-mono)' }}>✕</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* cross-platform overlap note */}
    <div style={{
      padding: '12px 16px',
      background: mix('var(--candle)', 8, 'var(--bg)'),
      borderLeft: '2px solid var(--candle)',
      marginBottom: 22,
    }}>
      <Eyebrow color="var(--candle)" size={9}>// cross-platform note</Eyebrow>
      <div style={{
        marginTop: 4,
        fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.55,
        color: 'var(--fg)',
      }}>{layer.overlap}</div>
    </div>

    {/* per-platform expanded cards */}
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
    }}>
      {window.MEMORY_PLATFORMS.map(p => {
        const data = layer[p.id];
        const absent = data.absent;
        return (
          <div key={p.id} style={{
            padding: 16,
            background: absent ? 'transparent' : 'var(--bg)',
            border: absent
              ? '1px dashed var(--line-loud)'
              : `1px solid ${mix(layer.tokenColor, 28, 'var(--line)')}`,
            borderRadius: 2,
            display: 'flex', flexDirection: 'column', gap: 10,
            opacity: absent ? 0.7 : 1,
          }}>
            <Eyebrow color={absent ? 'var(--fg-faint)' : layer.tokenColor} size={9}>
              {p.label}
            </Eyebrow>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600,
              letterSpacing: '-0.005em',
              color: 'var(--fg)', lineHeight: 1.2,
              fontVariationSettings: '"opsz" 48',
            }}>{data.label}</div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--fg-subtle)',
              fontStyle: 'italic', letterSpacing: '0.05em',
            }}>{data.location}</div>
            <p style={{
              margin: 0,
              fontFamily: 'var(--font-sans)', fontSize: 12.5, lineHeight: 1.5,
              color: 'var(--fg-muted)',
            }}>{data.desc}</p>

            <div style={{
              marginTop: 4,
              padding: '8px 10px',
              background: mix(layer.tokenColor, 4, 'var(--bg-elev-1)'),
              border: '1px solid var(--line)',
            }}>
              <Eyebrow color="var(--fg-faint)" size={9}>// how loaded</Eyebrow>
              <div style={{
                marginTop: 3,
                fontFamily: 'var(--font-sans)', fontSize: 11.5, lineHeight: 1.45,
                color: 'var(--fg-muted)',
              }}>{data.howLoaded}</div>
            </div>

            <div>
              <Eyebrow color="var(--fg-faint)" size={9}>// file structure</Eyebrow>
              <pre style={{
                marginTop: 4, marginBottom: 0,
                padding: '10px 12px',
                background: mix('var(--bg)', 92, 'black'),
                color: 'var(--fg)',
                fontFamily: 'var(--font-mono)', fontSize: 10.5,
                lineHeight: 1.55,
                border: `1px solid ${mix(layer.tokenColor, 18, 'var(--line)')}`,
                overflow: 'auto',
                whiteSpace: 'pre',
              }}>{data.fileTree}</pre>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// matrix ---------------------------------------------------------------------

const MemoryMatrix = () => {
  const [expanded, setExpanded] = useState(null);
  const layers = window.MEMORY_LAYERS;

  return (
    <div>
      <HeaderRow/>
      {layers.map((layer, i) => (
        <Row
          key={layer.id}
          layer={layer}
          expanded={expanded === layer.id}
          onToggle={() => setExpanded(expanded === layer.id ? null : layer.id)}
          isLast={i === layers.length - 1}
        />
      ))}
    </div>
  );
};

window.MemoryMatrix = MemoryMatrix;
