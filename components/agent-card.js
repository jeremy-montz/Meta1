// components/agent-card.js — Shared agent status card renderer
// Source of truth: dashboard.html. This file is a direct extraction.
// Both dashboard.html and agent profile pages load this script.
// Requires: SHEET_ID and STALE_DAYS to be set on window before calling.

// ── CSS injection ────────────────────────────────────────────────────────
(function injectCardCSS() {
  if (document.getElementById('agent-card-css')) return;
  var style = document.createElement('style');
  style.id = 'agent-card-css';
  style.textContent = `
.agent-card {
  background: var(--bg-elev-2); padding: 1.25rem; position: relative;
  transition: background var(--dur); display: flex; flex-direction: column;
  border: 1px solid var(--line-loud);
}
.agent-card:hover { background: var(--bg-elev-3); }
.agent-card::before { content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 3px; }
.agent-card[data-status="active"]::before { background: var(--ok); }
.agent-card[data-status="open"]::before { background: var(--open); }
.agent-card[data-status="idle"]::before { background: var(--fg-subtle); }
.agent-card[data-status="blocked"]::before { background: var(--err); }
.agent-card[data-status="flagged"]::before { background: var(--warn); }

/* ── Upper band ───────────────────────────────────────────── */
.card-upper { padding-left: 0.5rem; margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--line-loud); }
.upper-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 0.25rem; }
.upper-left { flex: 1; min-width: 0; }
.upper-right { display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0; margin-left: 0.75rem; gap: 0.2rem; }
.agent-name { font-family: var(--font-display); font-size: 1.25rem; font-weight: 500; letter-spacing: var(--ls-snug); color: var(--fg); line-height: var(--lh-tight); font-variation-settings: "opsz" 36; }
.agent-name a { color: inherit; text-decoration: none; }
.agent-name a:hover { color: var(--accent); }
.project-name { font-size: var(--fs-micro); color: var(--fg-faint); letter-spacing: var(--ls-wider); text-transform: uppercase; margin-top: 0.15rem; }
.card-timestamp { font-size: var(--fs-micro); color: var(--fg-faint); letter-spacing: var(--ls-wide); white-space: nowrap; }
.badge { font-family: var(--font-mono); font-size: var(--fs-xs); font-weight: 700; letter-spacing: var(--ls-wider); text-transform: uppercase; padding: 0.2rem 0.55rem; border-radius: var(--r-1); white-space: nowrap; }
.badge-active { background: color-mix(in oklch, var(--ok) 12%, transparent); color: var(--ok); }
.badge-open { background: color-mix(in oklch, var(--open) 12%, transparent); color: var(--open); }
.badge-idle { background: color-mix(in oklch, var(--fg-subtle) 20%, transparent); color: var(--fg-subtle); }
.badge-blocked { background: color-mix(in oklch, var(--err) 15%, transparent); color: var(--err); }
.badge-flagged { background: color-mix(in oklch, var(--warn) 15%, transparent); color: var(--warn); }
.mood-value { font-size: var(--fs-sm); color: var(--accent-deep); font-style: italic; letter-spacing: 0.02em; }
.persona-line { font-size: var(--fs-sm); color: var(--fg-subtle); font-style: italic; line-height: var(--lh-snug); margin-top: 0.35rem; }

/* ── Config pips ──────────────────────────────────────────── */
.config-layers { display: flex; gap: 3px; margin-top: 0.6rem; }
.layer-pip { display: flex; align-items: center; gap: 4px; padding: 3px 7px; border-radius: var(--r-1); font-size: 8px; font-weight: 700; letter-spacing: var(--ls-wide); text-transform: uppercase; border: 1px solid; cursor: default; position: relative; }
.layer-pip.reported { border-color: color-mix(in oklch, var(--layer-color) 40%, transparent); background: color-mix(in oklch, var(--layer-color) 8%, transparent); color: var(--layer-color); }
.layer-pip.not-reported { border-color: color-mix(in oklch, var(--fg-faint) 40%, transparent); background: color-mix(in oklch, var(--fg-faint) 8%, transparent); color: var(--fg-faint); }
.layer-pip .pip-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
.layer-pip.reported .pip-dot { background: var(--layer-color); }
.layer-pip.not-reported .pip-dot { background: var(--fg-faint); }
.layer-pip .pip-tip { display: none; position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); white-space: nowrap; background: var(--bg-elev-3); color: var(--fg-muted); border: 1px solid var(--line-loud); padding: 4px 8px; font-size: 9px; font-weight: 400; letter-spacing: 0.04em; text-transform: none; z-index: 10; pointer-events: none; }
.layer-pip:hover .pip-tip { display: block; }

/* ── Flag banner ──────────────────────────────────────────── */
.flag-banner { margin-top: 0.55rem; background: color-mix(in oklch, var(--err) 8%, transparent); border: 1px solid color-mix(in oklch, var(--err) 25%, transparent); padding: 0.4rem 0.65rem; font-size: var(--fs-xs); color: var(--err); letter-spacing: 0.05em; display: flex; align-items: baseline; gap: 0.4rem; }
.flag-reason { color: var(--fg-muted); }

/* ── Session section ──────────────────────────────────────── */
.card-session { padding-left: 0.5rem; flex: 1; }
.session-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
.session-label { font-size: var(--fs-xs); letter-spacing: var(--ls-wider); text-transform: uppercase; color: var(--fg-subtle); }
.session-stale-tag { font-size: 8px; letter-spacing: var(--ls-wider); text-transform: uppercase; color: var(--warn); background: color-mix(in oklch, var(--warn) 10%, transparent); border: 1px solid color-mix(in oklch, var(--warn) 20%, transparent); padding: 2px 6px; }
.session-date-tag { font-size: var(--fs-micro); color: var(--fg-faint); letter-spacing: var(--ls-wide); margin-right: 0.4rem; }
.session-field { margin-bottom: 0.5rem; }
.session-field-label { font-size: var(--fs-micro); letter-spacing: var(--ls-wider); text-transform: uppercase; color: var(--fg-faint); margin-bottom: 0.15rem; }
.session-field-value { font-size: var(--fs-sm); color: var(--fg-muted); line-height: var(--lh-normal); }
.card-session.stale { opacity: 0.6; }
.card-session.stale .session-field-value { color: var(--fg-subtle); }
.session-expand { font-size: var(--fs-xs); color: var(--fg-faint); letter-spacing: var(--ls-wide); cursor: pointer; text-align: right; margin-top: 0.35rem; transition: color var(--dur); }
.session-expand:hover { color: var(--accent); }
.session-detail { display: none; }
.session-detail.open { display: block; }
`;
  document.head.appendChild(style);
})();

// ── Functions (verbatim from dashboard.html) ─────────────────────────────
function csvUrl(tab) {
  return "https://docs.google.com/spreadsheets/d/" + SHEET_ID +
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
      obj[h.trim().replace(/^"|"$/g,"")] = (cols[i] || "").replace(/^"|"$/g,"").trim();
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

function esc(s) {
  return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// ── Date helpers ──────────────────────────────────────────
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

function sameDay(a, b) {
  if (!a || !b) return false;
  return a.toDateString() === b.toDateString();
}

// ── Compositing logic ─────────────────────────────────────
// Returns { openRow, closeRow, upperRow, isStale, displayStatus }
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

  // Upper band: most recent row of either type
  var upperRow = null;
  if (openRow && closeRow) {
    upperRow = openRow._ts > closeRow._ts ? openRow : closeRow;
  } else {
    upperRow = openRow || closeRow || null;
  }

  // Is the current session open? (open is more recent than close, or no close)
  var sessionIsOpen = openRow && (!closeRow || openRow._ts > closeRow._ts);

  // Session details stale if open is more recent than close
  var isStale = sessionIsOpen;

  // Derive status from checkin type, not self-reported field
  var displayStatus = "idle";
  if (upperRow) {
    if (upperRow === openRow && sessionIsOpen) {
      // Most recent is an open checkin
      var flags = (openRow["Flags"] || "").trim();
      displayStatus = flags ? "flagged" : "open";
    } else if (upperRow === closeRow) {
      // Most recent is a close checkin
      displayStatus = "active";
    }
    // Override to idle if stale
    if (daysSince(upperRow._ts) > STALE_DAYS) {
      displayStatus = "idle";
    }
  }

  return {
    openRow: openRow,
    closeRow: closeRow,
    upperRow: upperRow,
    sessionIsOpen: sessionIsOpen,
    isStale: isStale,
    displayStatus: displayStatus
  };
}

// ── Parse pass phrases ────────────────────────────────────
function parsePhrases(raw) {
  // Format: "L1: phrase | L2: phrase (version) | ..."
  var layers = { L1: null, L2: null, L3: null, L4: null };
  if (!raw) return layers;
  var parts = raw.split("|");
  parts.forEach(function(p) {
    var m = p.trim().match(/^(L\d):\s*(.+)/);
    if (m) layers[m[1]] = m[2].trim();
  });
  return layers;
}

// ── Render config pips ────────────────────────────────────
function renderPips(comp, isHuman) {
  if (isHuman) return ""; // no config layers for human card

  var openRow = comp.openRow;
  var closeRow = comp.closeRow;
  var sessionIsOpen = comp.sessionIsOpen;

  // L1-L4: always from the open-checkin row
  var phrases = parsePhrases(openRow ? openRow["Pass Phrases"] : "");

  // L5: lights only when close is newer than open AND has session summary
  var l5Reported = !sessionIsOpen && closeRow && closeRow["Session Summary"];

  function pip(label, phrase, color) {
    var reported = !!phrase && phrase !== "(not reported)";
    var cls = reported ? "reported" : "not-reported";
    var tip = reported ? esc(phrase) : "Not reported";
    return '<div class="layer-pip ' + cls + '" style="--layer-color: var(--' + color + ')">' +
      '<span class="pip-dot"></span>' + label +
      '<span class="pip-tip">' + tip + '</span></div>';
  }

  return '<div class="config-layers">' +
    pip("L1", phrases.L1, "L1") +
    pip("L2", phrases.L2, "L2") +
    pip("L3", phrases.L3, "L3") +
    pip("L4", phrases.L4, "L4") +
    pip("L5", l5Reported ? "Session data from close-checkin" : null, "L5") +
    '</div>';
}

// ── Render flag banner ────────────────────────────────────
function renderFlags(row) {
  if (!row) return "";
  var flags = (row["Flags"] || "").trim();
  var reason = (row["Flag Reason"] || "").trim();
  if (!flags) return "";
  return '<div class="flag-banner">' +
    '<span>⚑</span>' +
    '<span>' + esc(flags) + '</span>' +
    (reason ? '<span class="flag-reason">— ' + esc(reason) + '</span>' : '') +
    '</div>';
}

// ── Render one card ───────────────────────────────────────
function renderCard(entry, comp) {
  var upper = comp.upperRow;
  var close = comp.closeRow;
  var status = comp.displayStatus;
  var isStale = comp.isStale;
  var sessionIsOpen = comp.sessionIsOpen;

  if (!upper) {
    return '<div class="agent-card" data-status="idle">' +
      '<div class="card-upper"><div class="upper-top"><div class="upper-left">' +
      '<div class="agent-name">' + esc(entry.domain) + '</div></div></div>' +
      '<div class="persona-line" style="color:var(--fg-faint);font-style:italic">No data</div></div></div>';
  }

  var domain = upper["Domain"] || entry.domain;
  var project = upper["Project"] || "";
  var persona = upper["Persona"] || "";
  var mood = upper["Mood"] || "";
  var upperTs = parseDate(upper["Timestamp"]);
  var closeTs = close ? parseDate(close["Timestamp"]) : null;

  // Badge
  var badgeCls = "badge-" + status;
  var badgeText = status.toUpperCase();

  // Session details
  var summary = close ? (close["Session Summary"] || "") : "";
  var focus = close ? (close["Current Focus"] || "") : "";
  var blockers = close ? (close["Blockers"] || "") : "";
  var next = close ? (close["Next"] || "") : "";
  var hasDetail = focus || blockers || next;

  // Session date — only show if different day from upper timestamp
  var showSessionDate = isStale && closeTs && upperTs && !sameDay(closeTs, upperTs);

  // Jeremy's card: expand by default (no session summary for human)
  var defaultOpen = entry.isHuman;

  var detailId = "detail-" + entry.domain.toLowerCase();

  var html = '<div class="agent-card" data-status="' + esc(status) + '">';

  // ── Upper band ──
  html += '<div class="card-upper">';
  html += '<div class="upper-top">';
  html += '<div class="upper-left">';
  if (entry.url) {
    html += '<div class="agent-name"><a href="' + esc(entry.url) + '">' + esc(domain) + '</a></div>';
  } else {
    html += '<div class="agent-name">' + esc(domain) + '</div>';
  }
  if (project) html += '<div class="project-name">' + esc(project) + '</div>';
  html += '</div>';
  html += '<div class="upper-right">';
  html += '<div class="card-timestamp">' + esc(fmtDate(upperTs)) + '</div>';
  html += '<div class="badge ' + badgeCls + '">' + badgeText + '</div>';
  if (mood) html += '<div class="mood-value">' + esc(mood) + '</div>';
  html += '</div></div>';
  if (persona) html += '<div class="persona-line">' + esc(persona) + '</div>';

  // Config pips
  html += renderPips(comp, entry.isHuman);

  // Flags
  html += renderFlags(upper);

  html += '</div>';

  // ── Session section ──
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

// ── Row-wide expand/collapse ──────────────────────────────
function toggleRowDetails(el) {
  var card = el.closest('.agent-card');
  if (!card) return;
  var cardTop = card.getBoundingClientRect().top;

  // Find all cards in the same visual row (same top offset, within 2px tolerance)
  var allCards = document.querySelectorAll('.agent-card');
  var rowCards = [];
  allCards.forEach(function(c) {
    if (Math.abs(c.getBoundingClientRect().top - cardTop) < 2) {
      rowCards.push(c);
    }
  });

  // Determine target state from the clicked card's detail panel
  var clickedPanel = card.querySelector('.session-detail');
  var opening = clickedPanel && !clickedPanel.classList.contains('open');

  // Apply to all cards in the row
  rowCards.forEach(function(c) {
    var panel = c.querySelector('.session-detail');
    var toggle = c.querySelector('.session-expand');
    if (!panel || !toggle) return;
    if (opening) {
      panel.classList.add('open');
      toggle.innerHTML = '&#9662; less';
    } else {
      panel.classList.remove('open');
      toggle.innerHTML = '&#9656; more';
    }
  });
}

