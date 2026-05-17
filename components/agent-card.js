// components/agent-card.js — Shared agent status card renderer
// Used by dashboard.html and agent profile pages.
// Requires: SHEET_ID and STALE_DAYS to be defined before this script loads.

// ── CSS injection ────────────────────────────────────────────────────────
(function injectCardCSS() {
  if (document.getElementById('agent-card-css')) return;
  var style = document.createElement('style');
  style.id = 'agent-card-css';
  style.textContent = [
    '.agent-card { background: var(--bg-elev-2); padding: 1.25rem; position: relative; display: flex; flex-direction: column; border: 1px solid var(--line-loud); }',
    '.agent-card::before { content: ""; position: absolute; top: 0; left: 0; bottom: 0; width: 3px; }',
    '.agent-card[data-status="active"]::before { background: var(--ok); }',
    '.agent-card[data-status="open"]::before { background: var(--open, var(--info)); }',
    '.agent-card[data-status="idle"]::before { background: var(--fg-subtle); }',
    '.agent-card[data-status="blocked"]::before { background: var(--err); }',
    '.agent-card[data-status="flagged"]::before { background: var(--warn); }',
    '.card-upper { padding-left: 0.5rem; margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--line-loud); }',
    '.upper-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 0.25rem; }',
    '.upper-left { flex: 1; min-width: 0; }',
    '.upper-right { display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0; margin-left: 0.75rem; gap: 0.2rem; }',
    '.card-agent-name { font-family: var(--font-display); font-size: 1.25rem; font-weight: 500; letter-spacing: -0.02em; color: var(--fg); line-height: 1.1; font-variation-settings: "opsz" 36; }',
    '.card-agent-name a { color: inherit; text-decoration: none; }',
    '.card-agent-name a:hover { color: var(--accent); }',
    '.project-name { font-size: 9px; color: var(--fg-faint); letter-spacing: 0.22em; text-transform: uppercase; margin-top: 0.15rem; }',
    '.card-timestamp { font-size: 9px; color: var(--fg-faint); letter-spacing: 0.14em; white-space: nowrap; }',
    '.badge { font-family: var(--font-mono); font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; padding: 0.2rem 0.55rem; border-radius: 2px; white-space: nowrap; }',
    '.badge-active { background: color-mix(in oklch, var(--ok) 12%, transparent); color: var(--ok); }',
    '.badge-open { background: color-mix(in oklch, var(--open, var(--info)) 12%, transparent); color: var(--open, var(--info)); }',
    '.badge-idle { background: color-mix(in oklch, var(--fg-subtle) 20%, transparent); color: var(--fg-subtle); }',
    '.badge-blocked { background: color-mix(in oklch, var(--err) 15%, transparent); color: var(--err); }',
    '.badge-flagged { background: color-mix(in oklch, var(--warn) 15%, transparent); color: var(--warn); }',
    '.mood-value { font-size: 12px; color: var(--accent); font-style: italic; font-family: var(--font-display); letter-spacing: 0.02em; }',
    '.persona-line { font-size: 12px; color: var(--fg-subtle); font-style: italic; line-height: 1.4; margin-top: 0.35rem; }',
    '.config-layers { display: flex; gap: 3px; margin-top: 0.6rem; }',
    '.layer-pip { display: flex; align-items: center; gap: 4px; padding: 3px 7px; border-radius: 2px; font-size: 8px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; border: 1px solid; cursor: default; position: relative; }',
    '.layer-pip.reported { border-color: color-mix(in oklch, var(--layer-color) 40%, transparent); background: color-mix(in oklch, var(--layer-color) 8%, transparent); color: var(--layer-color); }',
    '.layer-pip.not-reported { border-color: color-mix(in oklch, var(--fg-faint) 40%, transparent); background: color-mix(in oklch, var(--fg-faint) 8%, transparent); color: var(--fg-faint); }',
    '.layer-pip .pip-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }',
    '.layer-pip.reported .pip-dot { background: var(--layer-color); }',
    '.layer-pip.not-reported .pip-dot { background: var(--fg-faint); }',
    '.layer-pip .pip-tip { display: none; position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); white-space: nowrap; background: var(--bg-elev-3, var(--bg-elev-2)); color: var(--fg-muted); border: 1px solid var(--line-loud); padding: 4px 8px; font-size: 9px; font-weight: 400; letter-spacing: 0.04em; text-transform: none; z-index: 10; pointer-events: none; }',
    '.layer-pip:hover .pip-tip { display: block; }',
    '.flag-banner { margin-top: 0.55rem; background: color-mix(in oklch, var(--err) 8%, transparent); border: 1px solid color-mix(in oklch, var(--err) 25%, transparent); padding: 0.4rem 0.65rem; font-size: 10px; color: var(--err); letter-spacing: 0.05em; display: flex; align-items: baseline; gap: 0.4rem; }',
    '.flag-reason { color: var(--fg-muted); }',
    '.card-session { padding-left: 0.5rem; flex: 1; }',
    '.card-session.stale { opacity: 0.6; }',
    '.card-session.stale .session-field-value { color: var(--fg-subtle); }',
    '.session-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }',
    '.session-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-subtle); }',
    '.session-stale-tag { font-size: 8px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--warn); background: color-mix(in oklch, var(--warn) 10%, transparent); border: 1px solid color-mix(in oklch, var(--warn) 20%, transparent); padding: 2px 6px; }',
    '.session-date-tag { font-size: 9px; color: var(--fg-faint); letter-spacing: 0.14em; margin-right: 0.4rem; }',
    '.session-field { margin-bottom: 0.5rem; }',
    '.session-field-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-faint); margin-bottom: 0.15rem; }',
    '.session-field-value { font-size: 12px; color: var(--fg-muted); line-height: 1.5; }',
    '.session-expand { font-size: 10px; color: var(--fg-faint); letter-spacing: 0.14em; cursor: pointer; text-align: right; margin-top: 0.35rem; }',
    '.session-expand:hover { color: var(--accent); }',
    '.session-detail { display: none; }',
    '.session-detail.open { display: block; }',
  ].join('\n');
  document.head.appendChild(style);
})();

// ── Utility functions ────────────────────────────────────────────────────
function csvUrl(tab) {
  return "https://docs.google.com/spreadsheets/d/" + window.SHEET_ID +
    "/gviz/tq?tqx=out:csv&sheet=" + encodeURIComponent(tab);
}

function parseCSV(text) {
  var lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  var headers = splitCSVLine(lines[0]);
  return lines.slice(1).map(function(line) {
    var cols = splitCSVLine(line);
    var obj = {};
    headers.forEach(function(h, i) {
      obj[h.trim().replace(/^"|"$/g, "")] = (cols[i] || "").replace(/^"|"$/g, "").trim();
    });
    return obj;
  });
}

function splitCSVLine(line) {
  var cols = [], inQ = false, cur = "";
  for (var i = 0; i < line.length; i++) {
    var c = line[i];
    if (c === '"') { inQ = !inQ; }
    else if (c === ',' && !inQ) { cols.push(cur); cur = ""; }
    else { cur += c; }
  }
  cols.push(cur);
  return cols;
}

function esc(s) { return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

function parseDate(raw) {
  if (!raw) return null;
  var d = new Date(raw);
  return isNaN(d) ? null : d;
}

function fmtDate(d) {
  if (!d) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    ", " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function fmtDateShort(d) {
  if (!d) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function daysSince(d) {
  if (!d) return Infinity;
  return (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
}

// ── Composite logic ──────────────────────────────────────────────────────
function compositeRows(rows) {
  var openRow = null, closeRow = null;
  rows.forEach(function(r) {
    var ts = parseDate(r["Timestamp"]);
    if (!ts) return;
    r._ts = ts;
    if (r["Type"] === "open") {
      if (!openRow || ts > openRow._ts) openRow = r;
    } else if (r["Type"] === "close") {
      if (!closeRow || ts > closeRow._ts) closeRow = r;
    }
  });
  var upperRow = openRow && closeRow ? (openRow._ts > closeRow._ts ? openRow : closeRow) : (openRow || closeRow || null);
  var sessionIsOpen = openRow && (!closeRow || openRow._ts > closeRow._ts);
  var displayStatus = "idle";
  if (upperRow) {
    if (upperRow === openRow && sessionIsOpen) {
      displayStatus = (openRow["Flags"] || "").trim() ? "flagged" : "open";
    } else if (upperRow === closeRow) {
      displayStatus = "active";
    }
    if (daysSince(upperRow._ts) > (window.STALE_DAYS || 7)) displayStatus = "idle";
  }
  return { openRow: openRow, closeRow: closeRow, upperRow: upperRow, sessionIsOpen: sessionIsOpen, displayStatus: displayStatus };
}

// ── Render helpers ───────────────────────────────────────────────────────
function parsePhrases(raw) {
  var layers = { L1: null, L2: null, L3: null, L4: null };
  if (!raw) return layers;
  raw.split("|").forEach(function(p) {
    var m = p.trim().match(/^(L\d):\s*(.+)/);
    if (m) layers[m[1]] = m[2].trim();
  });
  return layers;
}

function renderPips(comp, isHuman) {
  var phrases = parsePhrases(comp.openRow ? comp.openRow["Pass Phrases"] : "");
  var l5 = !comp.sessionIsOpen && comp.closeRow && comp.closeRow["Session Summary"];
  function pip(label, phrase, color) {
    var ok = !!phrase && phrase !== "(not reported)";
    return '<div class="layer-pip ' + (ok ? 'reported' : 'not-reported') + '" style="--layer-color: var(--' + color + ')">' +
      '<span class="pip-dot"></span>' + label +
      '<span class="pip-tip">' + (ok ? esc(phrase) : 'Not reported') + '</span></div>';
  }
  return '<div class="config-layers">' + pip("L1", phrases.L1, "L1") + pip("L2", phrases.L2, "L2") + pip("L3", phrases.L3, "L3") + pip("L4", phrases.L4, "L4") + pip("L5", l5 ? "Session close data" : null, "L5") + '</div>';
}

function renderFlags(row) {
  if (!row) return '';
  var flags = (row["Flags"] || "").trim();
  if (!flags) return '';
  var reason = (row["Flag Reason"] || "").trim();
  return '<div class="flag-banner"><span>⚑</span><span>' + esc(flags) + '</span>' +
    (reason ? '<span class="flag-reason">— ' + esc(reason) + '</span>' : '') + '</div>';
}

function renderCard(comp, opts) {
  opts = opts || {};
  var upper = comp.upperRow;
  if (!upper) return '<div class="agent-card" data-status="idle"><div class="card-upper"><div class="card-agent-name" style="color:var(--fg-faint);font-style:italic">No data yet</div></div></div>';

  var status = comp.displayStatus;
  var domain = upper["Domain"] || "";
  var project = upper["Project"] || "";
  var persona = upper["Persona"] || "";
  var mood = upper["Mood"] || "";
  var upperTs = parseDate(upper["Timestamp"]);
  var flags = (upper["Flags"] || "").trim();
  var flagReason = (upper["Flag Reason"] || "").trim();

  var html = '<div class="agent-card" data-status="' + esc(status) + '">';

  // ── Upper band ──
  html += '<div class="card-upper"><div class="upper-top"><div class="upper-left">';
  if (opts.nameLink) {
    html += '<div class="card-agent-name"><a href="' + esc(opts.nameLink) + '">' + esc(domain) + '</a></div>';
  } else {
    html += '<div class="card-agent-name">' + esc(domain) + '</div>';
  }
  if (project) html += '<div class="project-name">' + esc(project) + '</div>';
  html += '</div><div class="upper-right">';
  html += '<div class="card-timestamp">' + esc(fmtDate(upperTs)) + '</div>';
  html += '<div class="badge badge-' + status + '">' + status.toUpperCase() + '</div>';
  if (mood) html += '<div class="mood-value">' + esc(mood) + '</div>';
  html += '</div></div>';
  if (persona) html += '<div class="persona-line">' + esc(persona) + '</div>';
  html += renderPips(comp);
  html += renderFlags(upper);
  html += '</div>';

  // ── Session section ──
  var close = comp.closeRow;
  var closeTs = close ? parseDate(close["Timestamp"]) : null;
  var summary = close ? (close["Session Summary"] || "") : "";
  var focus = close ? (close["Current Focus"] || "") : "";
  var blockers = close ? (close["Blockers"] || "") : "";
  var next = close ? (close["Next Session"] || "") : "";
  var isStale = closeTs && daysSince(closeTs) > (window.STALE_DAYS || 7);
  var showSessionDate = closeTs && daysSince(closeTs) > 1;
  var hasDetail = focus || blockers || next;
  var defaultOpen = opts.expandSession || false;

  html += '<div class="card-session' + (isStale ? ' stale' : '') + '">';
  html += '<div class="session-header">';
  html += '<span class="session-label">session</span>';
  html += '<span>';
  if (showSessionDate) html += '<span class="session-date-tag">' + esc(fmtDateShort(closeTs)) + '</span>';
  if (isStale) html += '<span class="session-stale-tag">previous session</span>';
  html += '</span></div>';

  if (summary) {
    html += '<div class="session-field"><div class="session-field-label">Summary</div>' +
      '<div class="session-field-value">' + esc(summary) + '</div></div>';
  } else if (!close) {
    html += '<div class="session-field"><div class="session-field-value" style="color:var(--fg-faint);font-style:italic">No close-checkin yet</div></div>';
  }

  if (hasDetail) {
    var detailId = 'detail-' + Math.random().toString(36).substr(2, 6);
    html += '<div class="session-detail' + (defaultOpen ? ' open' : '') + '" id="' + detailId + '">';
    if (focus) html += '<div class="session-field"><div class="session-field-label">Focus</div><div class="session-field-value">' + esc(focus) + '</div></div>';
    if (blockers) html += '<div class="session-field"><div class="session-field-label">Blockers</div><div class="session-field-value">' + esc(blockers) + '</div></div>';
    if (next) html += '<div class="session-field"><div class="session-field-label">Next</div><div class="session-field-value">' + esc(next) + '</div></div>';
    html += '</div>';
    html += '<div class="session-expand" onclick="toggleRowDetails(this)">' +
      (defaultOpen ? '&#9662; less' : '&#9656; more') + '</div>';
  }

  html += '</div>'; // card-session
  html += '</div>'; // agent-card
  return html;
}

function toggleRowDetails(el) {
  var card = el.closest('.agent-card');
  if (!card) return;
  var panel = card.querySelector('.session-detail');
  var toggle = card.querySelector('.session-expand');
  if (!panel || !toggle) return;
  var opening = !panel.classList.contains('open');
  if (opening) {
    panel.classList.add('open');
    toggle.innerHTML = '&#9662; less';
  } else {
    panel.classList.remove('open');
    toggle.innerHTML = '&#9656; more';
  }
}

// Export for use
window.AgentCardUtils = {
  csvUrl: csvUrl, parseCSV: parseCSV, compositeRows: compositeRows,
  renderCard: renderCard, parseDate: parseDate, fmtDate: fmtDate,
  fmtDateShort: fmtDateShort, daysSince: daysSince, esc: esc,
  renderPips: renderPips, renderFlags: renderFlags,
};
