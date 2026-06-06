// ═══════════════════════════════════════════════════════
//  useDB — React hook that wires the DB layer into the app
// ═══════════════════════════════════════════════════════
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  saveSession, getAllSessions, deleteSession,
  saveNote, getNote, getAllNotes,
  saveChecklist, getChecklist, getAllChecklists,
  getCheckedTopics, setCheckedTopics,
  getTheme, setTheme as dbSetTheme,
  getNavTab, setNavTab as dbSetNavTab,
  getViewedPhases, setViewedPhases,
  calcXP, formatDate, getStorageStats, nukeAllData,
  ls,
} from '../utils/db';

export function useDB(analysis) {
  const [sessionId,     setSessionId]     = useState(null);
  const [sessions,      setSessions]      = useState([]);
  const [notes,         setNotes]         = useState({});       // topicId → markdown
  const [checklists,    setChecklists]    = useState({});       // topicId → [indices]
  const [viewedPhases,  setViewedPhasesS] = useState(new Set());
  const [storageStats,  setStorageStats]  = useState({ localStorageKB: '0' });
  const [dbReady,       setDbReady]       = useState(false);
  const saveTimers = useRef({});

  // ── Bootstrap ────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const vp  = getViewedPhases();
      const sts = getStorageStats();
      setViewedPhasesS(vp);
      setStorageStats(sts);

      const history = await getAllSessions();
      setSessions(history);
      setDbReady(true);
    })();
  }, []);

  // ── When analysis changes → save new session ─────────────
  useEffect(() => {
    if (!analysis) return;
    (async () => {
      const id = await saveSession(analysis);
      setSessionId(id);
      const [allNotes, allChecks, history] = await Promise.all([
        getAllNotes(id),
        getAllChecklists(id),
        getAllSessions(),
      ]);
      setNotes(allNotes);
      setChecklists(allChecks);
      setSessions(history);
      setStorageStats(getStorageStats());
    })();
  }, [analysis?.knownTopicIds?.join?.(',')]);

  // ── Notes ────────────────────────────────────────────────
  const updateNote = useCallback((topicId, markdown) => {
    setNotes(prev => ({ ...prev, [topicId]: markdown }));
    // Debounce DB write
    clearTimeout(saveTimers.current[topicId]);
    saveTimers.current[topicId] = setTimeout(async () => {
      if (sessionId) await saveNote(sessionId, topicId, markdown);
    }, 800);
  }, [sessionId]);

  // ── Checklists ───────────────────────────────────────────
  const updateChecklist = useCallback((topicId, indices) => {
    setChecklists(prev => ({ ...prev, [topicId]: indices }));
    if (sessionId) saveChecklist(sessionId, topicId, indices);
  }, [sessionId]);

  // ── Viewed phases (LS only) ───────────────────────────────
  const toggleViewedPhase = useCallback((phaseId) => {
    setViewedPhasesS(prev => {
      const next = new Set(prev);
      next.has(phaseId) ? next.delete(phaseId) : next.add(phaseId);
      setViewedPhases(next);
      return next;
    });
  }, []);

  // ── Delete a session from history ────────────────────────
  const removeSession = useCallback(async (id) => {
    await deleteSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
    setStorageStats(getStorageStats());
  }, []);

  // ── Full wipe ─────────────────────────────────────────────
  const wipeAll = useCallback(async () => {
    await nukeAllData();
    setSessionId(null);
    setSessions([]);
    setNotes({});
    setChecklists({});
    setStorageStats({ localStorageKB: '0' });
  }, []);

  return {
    sessionId,
    sessions,
    notes,
    checklists,
    viewedPhases,
    storageStats,
    dbReady,
    updateNote,
    updateChecklist,
    toggleViewedPhase,
    removeSession,
    wipeAll,
  };
}
