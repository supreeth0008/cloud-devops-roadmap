import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDB } from '../hooks/useDB';
import { toast } from './Toast';
import WebGLCanvas from './WebGLCanvas';
import TopicPanel  from './TopicPanel';
import AIInsights  from './AIInsights';
import Timeline    from './Timeline';
import History     from './History';
import Export      from './Export';
import confetti    from 'canvas-confetti';

gsap.registerPlugin(ScrollTrigger);

/* ── SVG ring ─────────────────────────────── */
function Ring({ pct, size = 52, color = 'var(--teal)' }) {
  const r = (size - 4) / 2, circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3.5" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="3.5"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dashoffset 1.2s var(--ease)', filter: `drop-shadow(0 0 4px ${color})` }} />
      <text x={size/2} y={size/2} dominantBaseline="middle" textAnchor="middle"
        fontFamily="var(--fm)" fontSize="8" fill={color} fontWeight="600">{pct}%</text>
    </svg>
  );
}

/* ── Skill strip ──────────────────────────── */
const SKILL_MAP = [
  { l: 'Linux', k: 'linux' }, { l: 'Networking', k: 'networking' }, { l: 'Docker', k: 'docker' },
  { l: 'K8s', k: 'kubernetes' }, { l: 'CI/CD', k: 'cicd' }, { l: 'Terraform', k: 'terraform' },
  { l: 'Cloud', k: 'aws' }, { l: 'Monitoring', k: 'monitoring' }, { l: 'Security', k: 'devsecops' }, { l: 'SRE', k: 'sre' },
];
function SkillStrip({ analysis }) {
  const { knownTopicIds, personalizedPhases = [] } = analysis;
  const partials = personalizedPhases.flatMap(p => p.topics.filter(t => t.status === 'partial').map(t => t.id));
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 40 }}>
      {SKILL_MAP.map(({ l, k }) => {
        const known = knownTopicIds.includes(k), part = partials.includes(k);
        const pct = known ? 100 : part ? 52 : 6;
        const col = known ? 'var(--teal)' : part ? 'var(--coral)' : 'rgba(255,255,255,0.14)';
        return (
          <div key={k} style={{ flex: '1 1 78px', minWidth: 68 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span className="mono" style={{ fontSize: 8, color: 'var(--w20)' }}>{l.toUpperCase()}</span>
              <span className="mono" style={{ fontSize: 8, color: col }}>{pct}%</span>
            </div>
            <div className="skill-bar-track">
              <div className="skill-bar-fill" style={{ width: `${pct}%`, background: col, boxShadow: known ? `0 0 7px ${col}` : 'none' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Horizontal scroll phase track (Active Theory rack-focus) ── */
function PhaseTrack({ phases, startPhaseIndex, learningStyle, sessionId, notes, checklists, onNoteChange, onChecklistChange, onToast }) {
  const trackRef    = useRef(null);
  const containerRef = useRef(null);
  const [focused, setFocused] = useState(startPhaseIndex);
  const prevPct     = useRef({});

  const phasePct = p => Math.round(p.topics.filter(t => t.status === 'known').length / p.topics.length * 100);

  // Fire confetti on phase completion
  useEffect(() => {
    phases.forEach(p => {
      const pct = phasePct(p);
      if (pct === 100 && (prevPct.current[p.id] || 0) < 100) {
        confetti({ particleCount: 80, spread: 65, origin: { y: 0.5 }, colors: ['#00FFD1', '#FF6B4A', '#F0EDE8'] });
        onToast?.(`${p.title} complete! 🎉`);
      }
      prevPct.current[p.id] = pct;
    });
  }, [phases]);

  // Scroll focused card into view
  useEffect(() => {
    const track = trackRef.current; if (!track) return;
    const cards = track.querySelectorAll('.h-card');
    if (cards[focused]) {
      cards[focused].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [focused]);

  const STATUS_COL = { known: 'var(--teal)', partial: 'var(--coral)', todo: 'rgba(255,255,255,0.2)' };
  const STATUS_LBL = { known: 'COMPLETE', partial: 'IN PROGRESS', todo: 'NOT STARTED' };

  const [expandedTopic, setExpandedTopic] = useState(null);

  return (
    <div ref={containerRef}>
      {/* Horizontal scroll container */}
      <div ref={trackRef} className="slim-scroll" style={{ overflowX: 'auto', paddingBottom: 8, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 2, width: 'max-content', padding: '2px 0' }}>
          {phases.map((phase, pi) => {
            const pct = phasePct(phase);
            const isFoc = focused === pi;
            const sc  = STATUS_COL[phase.phaseStatus];
            const sl  = STATUS_LBL[phase.phaseStatus];

            return (
              <div key={phase.id}
                className={`h-card ${isFoc ? 'focused' : 'unfocused'}`}
                onClick={() => setFocused(pi)}
                data-cursor="hot"
                style={{ flex: '0 0 380px', padding: '28px', position: 'relative', overflow: 'hidden', transition: 'all 0.35s var(--ease)', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', minHeight: 260 }}>
                <div className="card-scan" />

                {/* Top color bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${phase.color}, transparent)`, opacity: isFoc ? 1 : 0.3, transition: 'opacity 0.35s' }} />

                {/* Glow */}
                <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(200px circle at 50% 40%, ${phase.color}08, transparent)`, opacity: isFoc ? 1 : 0, transition: 'opacity 0.35s', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <div className="phase-icon-wrap" style={{ background: `${phase.color}18` }}>
                      {phase.icon}
                    </div>
                    <Ring pct={pct} size={46} color={sc} />
                  </div>

                  <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 18, color: isFoc ? 'var(--cream)' : 'var(--w35)', letterSpacing: '-0.02em', marginBottom: 6, transition: 'color 0.35s' }}>
                    {phase.title.replace(/Phase \d+:\s*/, '')}
                  </h3>
                  <p className="mono" style={{ fontSize: 9, color: 'var(--w20)', letterSpacing: '0.1em', marginBottom: 14 }}>
                    {phase.topics.length} TOPICS · ~{phase.estimatedWeeks}W
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="mono" style={{ fontSize: 8, color: sc, border: `1px solid ${sc}44`, borderRadius: 2, padding: '2px 8px', letterSpacing: '0.12em' }}>{sl}</span>
                    {pi === startPhaseIndex && (
                      <span className="mono" style={{ fontSize: 8, color: 'var(--teal)', border: '1px solid rgba(0,255,209,0.4)', borderRadius: 2, padding: '2px 8px', letterSpacing: '0.12em' }}>START</span>
                    )}
                  </div>

                  {/* Topic count bar */}
                  <div style={{ marginTop: 16 }}>
                    <div style={{ height: 2, background: 'var(--w06)', borderRadius: 1, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: sc, borderRadius: 1, transition: 'width 1s var(--ease)', boxShadow: pct === 100 ? `0 0 8px ${sc}` : 'none' }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Focused phase topic list */}
      {phases[focused] && (
        <div style={{ animation: 'fadeUp 0.45s var(--ease) both' }} key={focused}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <span style={{ fontSize: 20 }}>{phases[focused].icon}</span>
            <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 20, color: 'var(--cream)', letterSpacing: '-0.02em' }}>
              {phases[focused].title.replace(/Phase \d+:\s*/, '')}
            </h3>
            <p style={{ fontSize: 13, color: 'var(--w35)', marginLeft: 4 }}>{phases[focused].description}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(310px,1fr))', gap: 1 }}>
            {phases[focused].topics.map((topic) => {
              const isExp = expandedTopic === topic.id;
              const sc = { known: 'var(--teal)', partial: 'var(--coral)', todo: 'rgba(255,255,255,0.2)' }[topic.status];

              return (
                <div key={topic.id}>
                  <div className="topic-row"
                    onClick={() => setExpandedTopic(isExp ? null : topic.id)}
                    data-cursor="hot"
                    style={{ padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12, background: isExp ? 'rgba(0,255,209,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isExp ? 'rgba(0,255,209,0.25)' : 'var(--w06)'}` }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: sc, marginTop: 5, flexShrink: 0, boxShadow: topic.status === 'known' ? `0 0 7px ${sc}` : 'none' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontFamily: 'var(--fd)', fontWeight: 600, fontSize: 14, color: isExp ? 'var(--teal)' : 'var(--w80)', letterSpacing: '-0.01em', transition: 'color 0.2s' }}>
                        {topic.title}
                      </span>
                      <div style={{ display: 'flex', gap: 10, marginTop: 5, flexWrap: 'wrap' }}>
                        <span className="mono" style={{ fontSize: 8, color: 'var(--w20)' }}>{topic.estimatedHours}H</span>
                        <span className="mono" style={{ fontSize: 8, color: { beginner: 'var(--teal)', intermediate: 'var(--coral)', advanced: '#ff4444' }[topic.difficulty] }}>{topic.difficulty.toUpperCase()}</span>
                        {topic.status !== 'known' && <span className="mono" style={{ fontSize: 8, color: { high: 'var(--coral)', medium: '#ffb347', low: 'var(--teal)' }[topic.priority] }}>{topic.priority.toUpperCase()} PRIORITY</span>}
                        {(checklists?.[topic.id]?.length > 0) && <span className="mono" style={{ fontSize: 8, color: 'var(--teal)' }}>{checklists[topic.id].length}/{topic.subtopics.length} DONE</span>}
                      </div>
                    </div>
                    <span className="mono" style={{ fontSize: 9, color: 'var(--w20)', transition: 'transform 0.3s', transform: isExp ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>▼</span>
                  </div>

                  {isExp && (
                    <TopicPanel key={topic.id} topic={topic} phaseColor={phases[focused].color}
                      learningStyle={learningStyle} sessionId={sessionId}
                      note={notes?.[topic.id] || ''} checkedIndices={checklists?.[topic.id] || []}
                      onNoteChange={onNoteChange} onChecklistChange={onChecklistChange} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Pill nav ─────────────────────────────── */
const TABS = [
  { id: 'roadmap',  lbl: 'ROADMAP',  key: '1' },
  { id: 'insights', lbl: 'INSIGHTS', key: '2' },
  { id: 'timeline', lbl: 'TIMELINE', key: '3' },
  { id: 'history',  lbl: 'HISTORY',  key: '4' },
  { id: 'export',   lbl: 'EXPORT',   key: '5' },
];

/* ── Main RoadmapApp ──────────────────────── */
export default function RoadmapApp({ analysis, onReset }) {
  const [tab,    setTab]    = useState('roadmap');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const searchRef = useRef(null);
  const navRef    = useRef(null);
  const lastY     = useRef(0);

  const { sessionId, sessions, notes, checklists, storageStats, dbReady, updateNote, updateChecklist, removeSession, wipeAll } = useDB(analysis);

  // Keyboard shortcuts
  useEffect(() => {
    const h = e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const t = TABS.find(t => t.key === e.key);
      if (t) { setTab(t.id); window.scrollTo({ top: 0 }); }
      if (e.key === '/') { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === 'Escape') { setSearch(''); setFilter('all'); searchRef.current?.blur(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // Scroll-velocity nav
  useEffect(() => {
    const nav = navRef.current; if (!nav) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const diff = window.scrollY - lastY.current;
          nav.style.transform = `translateY(${diff > 2 ? '-2px' : '0'})`;
          lastY.current = window.scrollY; ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // DB toast
  useEffect(() => { if (dbReady && sessionId) toast.success(`Session #${sessionId} saved locally`); }, [dbReady, sessionId]);

  const allTopics  = (analysis.personalizedPhases || []).flatMap(p => p.topics);
  const knownCount = allTopics.filter(t => t.status === 'known').length;
  const overallPct = allTopics.length ? Math.round(knownCount / allTopics.length * 100) : 0;

  const filteredPhases = useMemo(() => {
    return (analysis.personalizedPhases || []).map(phase => {
      let topics = [...phase.topics];
      if (search.trim()) {
        const q = search.toLowerCase();
        topics = topics.filter(t => t.title.toLowerCase().includes(q) || t.keywords?.some(k => k.includes(q)) || t.subtopics?.some(s => s.toLowerCase().includes(q)));
      }
      if (filter !== 'all') topics = topics.filter(t => t.status === filter);
      return { ...phase, topics };
    }).filter(p => p.topics.length > 0);
  }, [analysis.personalizedPhases, filter, search]);

  const handleToast = useCallback(msg => toast.info(msg), []);

  const lvlCol = { junior: 'var(--teal)', mid: 'var(--coral)', senior: '#a970ff' }[analysis.experienceLevel];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--void)', color: 'var(--cream)' }}>
      <WebGLCanvas />
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'rgba(11,11,11,0.82)' }} />

      {/* ── STICKY NAV ── */}
      <nav ref={navRef} style={{ position: 'sticky', top: 0, zIndex: 200, background: 'rgba(11,11,11,0.92)', backdropFilter: 'blur(28px)', borderBottom: '1px solid var(--w06)', padding: '0 44px', display: 'flex', alignItems: 'stretch', transition: 'transform 0.15s' }}>
        <span className="mono" style={{ fontSize: 10, color: 'var(--w20)', letterSpacing: '0.2em', display: 'flex', alignItems: 'center', marginRight: 40, flexShrink: 0 }}>DEVOPSPATH_v5</span>

        {/* Pill tabs */}
        <div className="pill-nav" style={{ margin: 'auto 0' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); window.scrollTo({ top: 0 }); }}
              className={tab === t.id ? 'active' : ''}
              style={{ position: 'relative' }}>
              {t.lbl}
              <sup style={{ fontSize: 7, color: tab === t.id ? 'rgba(0,0,0,0.5)' : 'var(--w20)', fontFamily: 'var(--fm)', position: 'absolute', top: 7, right: 9 }}>{t.key}</sup>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginLeft: 'auto', flexShrink: 0 }}>
          <Ring pct={overallPct} size={36} color="var(--teal)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: dbReady ? 'var(--teal)' : 'var(--w20)', boxShadow: dbReady ? '0 0 8px var(--teal)' : 'none' }} />
            <span className="mono" style={{ fontSize: 9, color: dbReady ? 'rgba(0,255,209,0.55)' : 'var(--w20)', letterSpacing: '0.12em' }}>
              {dbReady ? `DB ${storageStats?.localStorageKB || 0}KB` : '…'}
            </span>
          </div>
          <button onClick={onReset} data-cursor="hot"
            className="mono" style={{ fontSize: 9, color: 'var(--w35)', background: 'none', border: '1px solid var(--w10)', borderRadius: 999, padding: '7px 16px', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--teal)'; e.target.style.color = 'var(--teal)'; }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--w10)'; e.target.style.color = 'var(--w35)'; }}>
            ← NEW RESUME
          </button>
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1060, margin: '0 auto', padding: '44px 44px 80px' }}>

        {/* Profile bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, paddingBottom: 32, borderBottom: '1px solid var(--w06)', marginBottom: 40, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', color: 'var(--cream)', marginBottom: 8 }}>
              {analysis.name || 'Your Roadmap'}
            </h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="mono" style={{ fontSize: 9, color: lvlCol, border: `1px solid ${lvlCol}44`, borderRadius: 2, padding: '2px 9px', letterSpacing: '0.14em' }}>
                {analysis.experienceLevel?.toUpperCase()}
              </span>
              <span className="mono" style={{ fontSize: 9, color: 'var(--w35)', letterSpacing: '0.1em' }}>{analysis.domain}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 28, marginLeft: 'auto', alignItems: 'center', flexWrap: 'wrap' }}>
            <Ring pct={overallPct} size={56} color="var(--teal)" />
            {[{ v: analysis.knownTopicIds?.length, l: 'KNOWN', c: 'var(--teal)' }, { v: `~${analysis.estimatedWeeksToComplete}w`, l: 'TIMELINE', c: 'var(--coral)' }].map(({ v, l, c }) => (
              <div key={l} style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--fd)', fontSize: 22, fontWeight: 800, color: c, lineHeight: 1 }}>{v}</div>
                <div className="mono" style={{ fontSize: 8, color: 'var(--w20)', letterSpacing: '0.14em', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* TAB: ROADMAP */}
        {tab === 'roadmap' && (
          <>
            <SkillStrip analysis={analysis} />

            {/* Filter + Search */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 28, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {['all', 'todo', 'partial', 'known'].map(f => (
                  <button key={f} onClick={() => setFilter(f)} className="mono"
                    style={{ fontSize: 9, letterSpacing: '0.14em', padding: '8px 14px', background: filter === f ? 'var(--teal)' : 'var(--w04)', border: `1px solid ${filter === f ? 'var(--teal)' : 'var(--w10)'}`, borderRadius: 2, color: filter === f ? '#000' : 'var(--w35)', transition: 'all 0.2s' }}>
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
              <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--w04)', border: '1px solid var(--w10)', borderRadius: 2, padding: '8px 14px' }}>
                <span className="mono" style={{ fontSize: 9, color: 'var(--w20)' }}>SEARCH</span>
                <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="kubernetes, prometheus, terraform…"
                  style={{ flex: 1, border: 'none', background: 'transparent', color: 'var(--w80)', fontSize: 12, fontFamily: 'var(--fm)', outline: 'none', letterSpacing: '0.05em' }} />
                {search && <button onClick={() => setSearch('')} className="mono" style={{ fontSize: 9, color: 'var(--w20)', background: 'none', border: 'none', padding: 2 }}>✕</button>}
              </div>
              <span className="mono" style={{ fontSize: 9, color: 'var(--w20)' }}>{filteredPhases.reduce((s, p) => s + p.topics.length, 0)} TOPICS</span>
              <div style={{ display: 'flex', gap: 12 }}>
                {[['1-5', 'TABS'], ['/', 'SEARCH'], ['ESC', 'CLEAR']].map(([k, l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}><kbd>{k}</kbd><span className="mono" style={{ fontSize: 8, color: 'var(--w20)' }}>{l}</span></div>
                ))}
              </div>
            </div>

            {filteredPhases.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div className="mono" style={{ color: 'var(--w20)', marginBottom: 20, letterSpacing: '0.16em' }}>NO RESULTS</div>
                <button onClick={() => { setSearch(''); setFilter('all'); }} className="mono"
                  style={{ fontSize: 9, color: 'var(--teal)', background: 'none', border: '1px solid var(--teal)', borderRadius: 2, padding: '9px 22px' }}>
                  CLEAR FILTERS
                </button>
              </div>
            ) : (
              <PhaseTrack
                phases={filteredPhases}
                startPhaseIndex={analysis.startPhaseIndex}
                learningStyle={analysis.learningStyle}
                sessionId={sessionId} notes={notes} checklists={checklists}
                onNoteChange={updateNote} onChecklistChange={updateChecklist}
                onToast={handleToast} />
            )}
          </>
        )}

        {tab === 'insights' && <AIInsights  analysis={analysis} />}
        {tab === 'timeline' && <Timeline   phases={analysis.personalizedPhases} startPhaseIndex={analysis.startPhaseIndex} />}
        {tab === 'history'  && <History    sessions={sessions} storageStats={storageStats} onRemove={id => { removeSession(id); toast.warn('Session deleted'); }} onWipe={() => { wipeAll(); toast.error('All data wiped'); }} />}
        {tab === 'export'   && <Export     analysis={analysis} />}
      </div>

      <footer style={{ position: 'relative', zIndex: 10, borderTop: '1px solid var(--w06)', padding: '18px 44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="mono" style={{ fontSize: 8, color: 'var(--w20)' }}>ALL DATA LOCAL · NO SERVERS · NO TRACKING · 1–5 SWITCH TABS · / SEARCH</span>
        <a href="https://github.com/supreeth0008/cloud-devops-roadmap" target="_blank" rel="noopener noreferrer"
          className="mono" data-cursor="link" style={{ fontSize: 8, color: 'var(--w35)', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => e.target.style.color = 'var(--teal)'}
          onMouseLeave={e => e.target.style.color = 'var(--w35)'}>
          GITHUB ↗
        </a>
      </footer>
    </div>
  );
}
