// ═══════════════════════════════════════════════════════════════════════
//  DevOpsPath — Dual-Layer Local Database
//  • Layer 1: localStorage  → quick-access state (XP, theme, checked topics)
//  • Layer 2: IndexedDB     → full history, resume text, notes, sessions
//  Everything runs on the USER'S OWN SYSTEM. Zero servers. Zero uploads.
// ═══════════════════════════════════════════════════════════════════════

const DB_NAME    = 'devopspath_db';
const DB_VERSION = 2;
const STORES = {
  sessions:  'sessions',    // full analysis sessions (history)
  notes:     'notes',       // per-topic user notes
  checklist: 'checklist',   // per-topic subtopic completions
  settings:  'settings',    // app settings
};

// ── LS KEYS ──────────────────────────────────────────────────────────────
const LS = {
  THEME:           'devopspath_theme',
  XP:              'devopspath_xp',
  ACTIVE_SESSION:  'devopspath_active_session_id',
  CHECKED_TOPICS:  'devopspath_checked',   // JSON map topicId→[indices]
  LAST_ANALYSIS:   'devopspath_last',      // lightweight analysis cache
  VIEWED_PHASES:   'devopspath_viewed',    // JSON Set of expanded phases
  NAV_TAB:         'devopspath_nav',       // last active nav tab
  ONBOARDING_DONE: 'devopspath_onboarded',
};

// ────────────────────────────────────────────────────────────────────────
//  localStorage helpers  (sync, tiny payloads)
// ────────────────────────────────────────────────────────────────────────
export const ls = {
  get: (key, fallback = null) => {
    try {
      const v = localStorage.getItem(key);
      return v !== null ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  set: (key, val) => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  },
  del: (key) => { try { localStorage.removeItem(key); } catch {} },
  clear: () => {
    Object.values(LS).forEach(k => ls.del(k));
  },
};

// Convenience wrappers
export const getTheme          = ()    => ls.get(LS.THEME, 'dark');
export const setTheme          = (t)   => ls.set(LS.THEME, t);
export const getNavTab         = ()    => ls.get(LS.NAV_TAB, 'roadmap');
export const setNavTab         = (t)   => ls.set(LS.NAV_TAB, t);
export const getCheckedTopics  = ()    => ls.get(LS.CHECKED_TOPICS, {});
export const setCheckedTopics  = (map) => ls.set(LS.CHECKED_TOPICS, map);
export const getViewedPhases   = ()    => new Set(ls.get(LS.VIEWED_PHASES, []));
export const setViewedPhases   = (s)   => ls.set(LS.VIEWED_PHASES, [...s]);
export const isOnboarded       = ()    => ls.get(LS.ONBOARDING_DONE, false);
export const markOnboarded     = ()    => ls.set(LS.ONBOARDING_DONE, true);

// ────────────────────────────────────────────────────────────────────────
//  IndexedDB setup
// ────────────────────────────────────────────────────────────────────────
let _db = null;

function openDB() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;

      // Sessions store — full analysis history
      if (!db.objectStoreNames.contains(STORES.sessions)) {
        const s = db.createObjectStore(STORES.sessions, { keyPath: 'id', autoIncrement: true });
        s.createIndex('createdAt', 'createdAt', { unique: false });
        s.createIndex('name',      'name',      { unique: false });
      }

      // Notes store — per-topic markdown notes
      if (!db.objectStoreNames.contains(STORES.notes)) {
        const n = db.createObjectStore(STORES.notes, { keyPath: ['sessionId', 'topicId'] });
        n.createIndex('sessionId', 'sessionId', { unique: false });
      }

      // Checklist store — subtopic completion state
      if (!db.objectStoreNames.contains(STORES.checklist)) {
        const c = db.createObjectStore(STORES.checklist, { keyPath: ['sessionId', 'topicId'] });
        c.createIndex('sessionId', 'sessionId', { unique: false });
      }

      // Settings store — global app settings
      if (!db.objectStoreNames.contains(STORES.settings)) {
        db.createObjectStore(STORES.settings, { keyPath: 'key' });
      }
    };

    req.onsuccess = (e) => { _db = e.target.result; resolve(_db); };
    req.onerror   = (e) => reject(e.target.error);
  });
}

function tx(storeName, mode = 'readonly') {
  return openDB().then(db => {
    const t = db.transaction(storeName, mode);
    return t.objectStore(storeName);
  });
}

function promisify(req) {
  return new Promise((res, rej) => {
    req.onsuccess = () => res(req.result);
    req.onerror   = () => rej(req.error);
  });
}

// ────────────────────────────────────────────────────────────────────────
//  SESSION CRUD
// ────────────────────────────────────────────────────────────────────────

/**
 * Save an analysis session to IndexedDB.
 * Stores the full analysis object minus the large personalizedPhases detail
 * to keep the index fast. Phase data is re-derived on load.
 */
export async function saveSession(analysis) {
  const store = await tx(STORES.sessions, 'readwrite');
  const record = {
    name:             analysis.name || 'Anonymous',
    createdAt:        Date.now(),
    experienceLevel:  analysis.experienceLevel,
    yearsOfExperience:analysis.yearsOfExperience,
    domain:           analysis.domain,
    learningStyle:    analysis.learningStyle,
    education:        analysis.education,
    knownTopicIds:    analysis.knownTopicIds,
    knownPhaseIds:    analysis.knownPhaseIds,
    estimatedWeeks:   analysis.estimatedWeeksToComplete,
    certifications:   analysis.recommendedCertifications,
    profileSummary:   analysis.profileSummary,
    startPhaseIndex:  analysis.startPhaseIndex,
    xp:               calcXP(analysis),
  };
  const id = await promisify(store.add(record));
  // Update LS with active session id
  ls.set(LS.ACTIVE_SESSION, id);
  return id;
}

/**
 * Load all sessions (for history panel), newest first.
 */
export async function getAllSessions() {
  try {
    const store = await tx(STORES.sessions, 'readonly');
    const all = await promisify(store.getAll());
    return all.sort((a, b) => b.createdAt - a.createdAt);
  } catch { return []; }
}

/**
 * Load a single session by id.
 */
export async function getSession(id) {
  try {
    const store = await tx(STORES.sessions, 'readonly');
    return await promisify(store.get(id));
  } catch { return null; }
}

/**
 * Delete a session and all its notes/checklists.
 */
export async function deleteSession(id) {
  try {
    const [s, n, c] = await Promise.all([
      tx(STORES.sessions, 'readwrite'),
      tx(STORES.notes,    'readwrite'),
      tx(STORES.checklist,'readwrite'),
    ]);
    await promisify(s.delete(id));

    // Delete all notes for this session
    const notesIdx = n.index('sessionId');
    const noteCursor = await promisify(notesIdx.openCursor(IDBKeyRange.only(id)));
    let nc = noteCursor;
    while (nc) { nc.delete(); nc = await promisify(nc.continue()).catch(() => null); }

    // Delete all checklists for this session
    const checkIdx = c.index('sessionId');
    const checkCursor = await promisify(checkIdx.openCursor(IDBKeyRange.only(id)));
    let cc = checkCursor;
    while (cc) { cc.delete(); cc = await promisify(cc.continue()).catch(() => null); }
  } catch (e) { console.warn('deleteSession error:', e); }
}

// ────────────────────────────────────────────────────────────────────────
//  NOTES CRUD
// ────────────────────────────────────────────────────────────────────────

export async function saveNote(sessionId, topicId, markdown) {
  const store = await tx(STORES.notes, 'readwrite');
  await promisify(store.put({ sessionId, topicId, markdown, updatedAt: Date.now() }));
}

export async function getNote(sessionId, topicId) {
  try {
    const store = await tx(STORES.notes, 'readonly');
    const rec = await promisify(store.get([sessionId, topicId]));
    return rec?.markdown || '';
  } catch { return ''; }
}

export async function getAllNotes(sessionId) {
  try {
    const store = await tx(STORES.notes, 'readonly');
    const idx   = store.index('sessionId');
    const all   = await promisify(idx.getAll(IDBKeyRange.only(sessionId)));
    const map = {};
    all.forEach(n => { map[n.topicId] = n.markdown; });
    return map;
  } catch { return {}; }
}

// ────────────────────────────────────────────────────────────────────────
//  CHECKLIST (subtopic completion) — fast IndexedDB writes
// ────────────────────────────────────────────────────────────────────────

export async function saveChecklist(sessionId, topicId, checkedIndices) {
  const store = await tx(STORES.checklist, 'readwrite');
  await promisify(store.put({ sessionId, topicId, checkedIndices, updatedAt: Date.now() }));
  // Mirror to localStorage for instant reads
  const map = getCheckedTopics();
  map[topicId] = checkedIndices;
  setCheckedTopics(map);
}

export async function getChecklist(sessionId, topicId) {
  // Try localStorage first (fast)
  const lsMap = getCheckedTopics();
  if (lsMap[topicId]) return lsMap[topicId];
  // Fallback to IndexedDB
  try {
    const store = await tx(STORES.checklist, 'readonly');
    const rec = await promisify(store.get([sessionId, topicId]));
    return rec?.checkedIndices || [];
  } catch { return []; }
}

export async function getAllChecklists(sessionId) {
  try {
    const store = await tx(STORES.checklist, 'readonly');
    const idx   = store.index('sessionId');
    const all   = await promisify(idx.getAll(IDBKeyRange.only(sessionId)));
    const map = {};
    all.forEach(c => { map[c.topicId] = c.checkedIndices; });
    return map;
  } catch { return {}; }
}

// ────────────────────────────────────────────────────────────────────────
//  SETTINGS
// ────────────────────────────────────────────────────────────────────────

export async function saveSetting(key, value) {
  try {
    const store = await tx(STORES.settings, 'readwrite');
    await promisify(store.put({ key, value, updatedAt: Date.now() }));
  } catch {}
}

export async function getSetting(key, fallback = null) {
  try {
    const store = await tx(STORES.settings, 'readonly');
    const rec = await promisify(store.get(key));
    return rec?.value ?? fallback;
  } catch { return fallback; }
}

// ────────────────────────────────────────────────────────────────────────
//  UTILITY
// ────────────────────────────────────────────────────────────────────────

export function calcXP(analysis) {
  let xp = (analysis.knownTopicIds?.length || 0) * 150;
  if (analysis.experienceLevel === 'mid')    xp += 300;
  if (analysis.experienceLevel === 'senior') xp += 700;
  return xp;
}

export function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function getStorageStats() {
  let lsBytes = 0;
  try {
    for (const key of Object.keys(localStorage)) {
      lsBytes += localStorage.getItem(key)?.length || 0;
    }
  } catch {}
  return {
    localStorageKB: (lsBytes / 1024).toFixed(1),
  };
}

/**
 * Full nuclear reset — clears ALL DevOpsPath data from LS + IDB.
 */
export async function nukeAllData() {
  ls.clear();
  try {
    await new Promise((res, rej) => {
      const r = indexedDB.deleteDatabase(DB_NAME);
      r.onsuccess = res;
      r.onerror   = rej;
    });
    _db = null;
  } catch {}
}
