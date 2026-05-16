/* ============================================================================
 * sheet-fetch.js · LIVE DATA OVERLAY
 * ----------------------------------------------------------------------------
 * Fetches volatile agent state from the Google Sheet checkin tabs and merges
 * it onto the static AGENTS skeleton from data.js.
 *
 * Architecture:
 *   data.js      → stable identity (name, role, blurb, project)
 *   Checkin sheet → volatile state  (status, mood, flags, session, lastSeen)
 *   (future) persona-matrix → config (display order, dials)
 *
 * Usage:
 *   <script src="data.js"></script>
 *   <script src="sheet-fetch.js"></script>
 *   <!-- then in React: -->
 *   const { agents, fetchStatus } = useSheetData();
 *
 * Exports (window globals):
 *   SHEET_CONFIG          — Sheet ID + domain tab mapping
 *   fetchCheckinData()    — returns Promise<Map<domainId, CompositeResult>>
 *   mergeAgentData(base, live) — returns new agents array with live overlay
 *   useSheetData()        — React hook: { agents, fetchStatus, refetch }
 *
 * fetchStatus is one of: 'loading' | 'live' | 'offline'
 * ========================================================================== */

// ── Configuration ────────────────────────────────────────────────────────
window.SHEET_CONFIG = {
  sheetId: '16OAh0lBMAZJLhJqsu1574PBsD7tkP_sqHIZa58t_-VI',
  staleDays: 7,
  tabs: [
    { tab: 'Meta1Checkin',    domain: 'meta1',    order: 1 },
    { tab: 'BondCheckin',     domain: 'bond',     order: 2 },
    { tab: 'HouseCheckin',    domain: 'house',    order: 3 },
    { tab: 'FreedomCheckin',  domain: 'freedom',  order: 4 },
    { tab: 'EvolveCheckin',   domain: 'evolve',   order: 5 },
    { tab: 'AssessorCheckin', domain: 'assessor', order: 6 },
    { tab: 'PhilCheckin',     domain: 'phil',     order: 7 },
    { tab: 'HumanCheckin',    domain: 'jeremy',   order: 8 },
  ],
};

// ── CSV helpers (extracted from dashboard.html) ──────────────────────────

function _sheetCsvUrl(tab) {
  return 'https://docs.google.com/spreadsheets/d/' + SHEET_CONFIG.sheetId +
    '/gviz/tq?tqx=out:csv&sheet=' + encodeURIComponent(tab);
}

function _splitCSVLine(line) {
  var cols = [], inQ = false, cur = '';
  for (var i = 0; i < line.length; i++) {
    var c = line[i];
    if (c === '"') { inQ = !inQ; }
    else if (c === ',' && !inQ) { cols.push(cur); cur = ''; }
    else { cur += c; }
  }
  cols.push(cur);
  return cols;
}

function _parseCSV(text) {
  var lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  var headers = _splitCSVLine(lines[0]);
  return lines.slice(1).map(function(line) {
    var cols = _splitCSVLine(line);
    var obj = {};
    headers.forEach(function(h, i) {
      obj[h.trim().replace(/^"|"$/g, '')] = (cols[i] || '').replace(/^"|"$/g, '').trim();
    });
    return obj;
  });
}

function _parseDate(raw) {
  if (!raw) return null;
  var d = new Date(raw);
  return isNaN(d) ? null : d;
}

function _daysSince(d) {
  if (!d) return Infinity;
  return (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
}

// ── Compositing logic (extracted from dashboard.html) ────────────────────
// Takes all checkin rows for one domain, returns derived state.

function _compositeRows(rows) {
  var openRow = null, closeRow = null;

  rows.forEach(function(r) {
    var ts = _parseDate(r['Timestamp']);
    if (!ts) return;
    r._ts = ts;
    if (r['Type'] === 'open') {
      if (!openRow || ts > openRow._ts) openRow = r;
    } else if (r['Type'] === 'close') {
      if (!closeRow || ts > closeRow._ts) closeRow = r;
    }
  });

  var upperRow = null;
  if (openRow && closeRow) {
    upperRow = openRow._ts > closeRow._ts ? openRow : closeRow;
  } else {
    upperRow = openRow || closeRow || null;
  }

  var sessionIsOpen = openRow && (!closeRow || openRow._ts > closeRow._ts);

  // Derive status from checkin type
  var displayStatus = 'idle';
  if (upperRow) {
    if (upperRow === openRow && sessionIsOpen) {
      var flags = (openRow['Flags'] || '').trim();
      displayStatus = flags ? 'flagged' : 'open';
    } else if (upperRow === closeRow) {
      displayStatus = 'active';
    }
    if (_daysSince(upperRow._ts) > SHEET_CONFIG.staleDays) {
      displayStatus = 'idle';
    }
  }

  return {
    openRow: openRow,
    closeRow: closeRow,
    upperRow: upperRow,
    sessionIsOpen: sessionIsOpen,
    displayStatus: displayStatus,
  };
}

// ── Public: fetch all checkin tabs ───────────────────────────────────────

window.fetchCheckinData = function fetchCheckinData() {
  var bust = '&cachebust=' + Date.now();

  var fetches = SHEET_CONFIG.tabs.map(function(entry) {
    return fetch(_sheetCsvUrl(entry.tab) + bust)
      .then(function(r) { return r.text(); })
      .then(function(text) {
        var rows = _parseCSV(text);
        var comp = _compositeRows(rows);
        return { domain: entry.domain, comp: comp };
      })
      .catch(function() {
        return { domain: entry.domain, comp: null };
      });
  });

  return Promise.all(fetches).then(function(results) {
    var map = {};
    results.forEach(function(r) {
      map[r.domain] = r.comp;
    });
    return map;
  });
};

// ── Public: merge live data onto static AGENTS skeleton ─────────────────
// Returns a NEW array (does not mutate the originals).
//
// Live fields overlaid: state, mood, flag, session, lastSeen
// Static fields preserved: id, name, project, role, blurb

window.mergeAgentData = function mergeAgentData(baseAgents, liveMap) {
  if (!liveMap) return baseAgents;

  return baseAgents.map(function(agent) {
    var live = liveMap[agent.id];
    if (!live || !live.upperRow) return agent;

    var upper = live.upperRow;
    var close = live.closeRow;

    // Build merged agent — spread static, overlay volatile
    var merged = {};
    Object.keys(agent).forEach(function(k) { merged[k] = agent[k]; });

    // Volatile fields from Sheet
    merged.state    = live.displayStatus === 'flagged' ? 'flagged' : live.displayStatus;
    merged.mood     = upper['Mood'] || agent.mood;
    merged.flag     = (upper['Flags'] || '').trim() || null;
    merged.flagReason = (upper['Flag Reason'] || '').trim() || null;
    merged.lastSeen = upper._ts ? _fmtDate(upper._ts) : agent.lastSeen;

    // Session summary from close-checkin (most recent completed session)
    if (close && close['Session Summary']) {
      merged.session = close['Session Summary'];
    }

    return merged;
  });
};

function _fmtDate(d) {
  if (!d) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ', ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

// ── Public: React hook ──────────────────────────────────────────────────
// Returns { agents, fetchStatus, refetch }
//   agents      — AGENTS array with live data overlaid (or static fallback)
//   fetchStatus — 'loading' | 'live' | 'offline'
//   refetch     — call to re-fetch from Sheet

window.useSheetData = function useSheetData() {
  var _React = window.React;
  var _s = _React.useState;
  var _e = _React.useEffect;
  var _cb = _React.useCallback;

  var agentsState = _s(window.AGENTS);
  var agents = agentsState[0], setAgents = agentsState[1];

  var statusState = _s('loading');
  var fetchStatus = statusState[0], setFetchStatus = statusState[1];

  var doFetch = _cb(function() {
    setFetchStatus('loading');
    window.fetchCheckinData()
      .then(function(liveMap) {
        // Check if we actually got any data
        var gotData = Object.keys(liveMap).some(function(k) {
          return liveMap[k] && liveMap[k].upperRow;
        });
        if (gotData) {
          setAgents(window.mergeAgentData(window.AGENTS, liveMap));
          setFetchStatus('live');
        } else {
          setFetchStatus('offline');
        }
      })
      .catch(function() {
        setFetchStatus('offline');
      });
  }, []);

  _e(function() { doFetch(); }, [doFetch]);

  return { agents: agents, fetchStatus: fetchStatus, refetch: doFetch };
};
