import { useState } from 'react';
import NoteEditor from './NoteEditor';

const STYLES = {
  visual:  { e: '🎨', l: 'VISUAL',   c: '#a970ff' },
  handson: { e: '🛠',  l: 'HANDS-ON', c: 'var(--teal)' },
  reading: { e: '📖', l: 'READING',  c: 'var(--coral)' },
  video:   { e: '▶',  l: 'VIDEO',    c: '#f0ede8' },
};
const RES = { book: '▸ BOOK', docs: '▸ DOCS', course: '▸ COURSE', interactive: '▸ LAB', practice: '▸ PRACTICE', tutorial: '▸ GUIDE', video: '▸ VIDEO', reference: '▸ REF' };

export default function TopicPanel({ topic, phaseColor, learningStyle, sessionId, note = '', checkedIndices = [], onNoteChange, onChecklistChange }) {
  const [tab, setTab] = useState('path');
  const sc  = STYLES[learningStyle] || STYLES.handson;
  const pct = topic.subtopics?.length ? Math.round(checkedIndices.length / topic.subtopics.length * 100) : 0;

  const toggle = i => {
    const next = checkedIndices.includes(i) ? checkedIndices.filter(x => x !== i) : [...checkedIndices, i];
    onChecklistChange?.(topic.id, next);
  };

  const TABS = [{ id: 'path', lbl: `${sc.e} PATH` }, { id: 'list', lbl: `LIST (${topic.subtopics?.length})` }, { id: 'links', lbl: `LINKS (${topic.resources?.length})` }, { id: 'proj', lbl: 'PROJECTS' }, { id: 'notes', lbl: `NOTES${note?.trim() ? ' ●' : ''}` }];

  return (
    <div style={{ borderTop: `2px solid ${phaseColor}44`, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--w06)', borderTop: `2px solid ${phaseColor}55` }}
      onClick={e => e.stopPropagation()}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--w06)', overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className="mono"
            style={{ fontSize: 9, letterSpacing: '0.12em', padding: '10px 16px', background: 'none', border: 'none', borderBottom: tab === t.id ? `1px solid ${phaseColor}` : '1px solid transparent', color: tab === t.id ? 'var(--cream)' : 'var(--w20)', transition: 'color 0.15s', marginBottom: '-1px', whiteSpace: 'nowrap' }}>
            {t.lbl}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px 18px 20px 28px', animation: 'fadeUp 0.3s var(--ease) both' }}>

        {tab === 'path' && (
          <div>
            <div style={{ background: `${phaseColor}0a`, border: `1px solid ${phaseColor}22`, borderLeft: `2px solid ${phaseColor}`, padding: '14px 16px', marginBottom: 14 }}>
              <p className="mono" style={{ fontSize: 9, color: sc.c, letterSpacing: '0.14em', marginBottom: 8 }}>{sc.e} {sc.l} PATH — PERSONALIZED FOR YOU</p>
              <p style={{ fontSize: 13, color: 'var(--w55)', lineHeight: 1.75 }}>{topic.personalizedStyle || topic.teachingMethod?.[learningStyle]}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 6 }}>
              {Object.entries(topic.teachingMethod || {}).map(([style, text]) => {
                const cfg = STYLES[style]; if (!cfg) return null;
                const active = style === learningStyle;
                return (
                  <div key={style} style={{ padding: '12px', background: active ? `${phaseColor}08` : 'rgba(255,255,255,0.02)', border: `1px solid ${active ? phaseColor + '33' : 'var(--w06)'}`, borderRadius: 2, opacity: active ? 1 : 0.55 }}>
                    <p className="mono" style={{ fontSize: 8, color: active ? cfg.c : 'var(--w20)', letterSpacing: '0.14em', marginBottom: 6 }}>{cfg.e} {cfg.l}{active ? ' ← YOU' : ''}</p>
                    <p style={{ fontSize: 11, color: 'var(--w35)', lineHeight: 1.6 }}>{text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'list' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span className="mono" style={{ fontSize: 8, color: 'var(--w20)', letterSpacing: '0.12em' }}>CLICK TO MARK · AUTO-SAVED TO INDEXEDDB</span>
              <span className="mono" style={{ fontSize: 8, color: pct === 100 ? 'var(--teal)' : 'var(--w35)' }}>{pct}%</span>
            </div>
            <div style={{ height: 1, background: 'var(--w06)', marginBottom: 14, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: 'var(--teal)', transition: 'width 0.4s var(--ease)', boxShadow: pct === 100 ? '0 0 8px var(--teal)' : '' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 4 }}>
              {topic.subtopics?.map((s, i) => {
                const done = checkedIndices.includes(i);
                return (
                  <div key={i} onClick={() => toggle(i)} data-cursor="hot"
                    style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', background: done ? 'rgba(0,255,209,0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${done ? 'rgba(0,255,209,0.25)' : 'var(--w06)'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
                    <div style={{ width: 14, height: 14, borderRadius: 2, border: `1px solid ${done ? 'var(--teal)' : 'var(--w20)'}`, background: done ? 'var(--teal)' : 'transparent', flexShrink: 0, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                      {done && <span style={{ fontSize: 9, color: '#000', fontWeight: 900 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 12, color: done ? 'var(--w20)' : 'var(--w55)', textDecoration: done ? 'line-through' : 'none', lineHeight: 1.5, transition: 'all 0.15s' }}>{s}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'links' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 4 }}>
            {topic.resources?.map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" data-cursor="link"
                style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '13px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--w06)', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = `${phaseColor}55`; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'var(--w06)'; }}>
                <span className="mono" style={{ fontSize: 8, color: phaseColor, letterSpacing: '0.1em', flexShrink: 0 }}>{RES[r.type] || '▸'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: 'var(--w55)', fontWeight: 500, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
                  <div className="mono" style={{ fontSize: 8, color: 'var(--w20)' }}>{r.type?.toUpperCase()}</div>
                </div>
                <span style={{ fontSize: 12, color: 'var(--w20)', flexShrink: 0 }}>↗</span>
              </a>
            ))}
          </div>
        )}

        {tab === 'proj' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {topic.projects?.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--w06)' }}>
                <span className="mono" style={{ fontSize: 11, color: phaseColor, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>0{i + 1}</span>
                <div>
                  <p style={{ fontSize: 13, color: 'var(--w55)', lineHeight: 1.65, marginBottom: 10 }}>{p}</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['PORTFOLIO', 'GITHUB-WORTHY', 'INTERVIEW READY'].map(tag => (
                      <span key={tag} className="mono" style={{ fontSize: 8, color: 'var(--w20)', border: '1px solid var(--w10)', borderRadius: 2, padding: '2px 7px' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div style={{ padding: '12px 14px', background: 'var(--teal10)', border: '1px solid var(--teal20)' }}>
              <span className="mono" style={{ fontSize: 8, color: 'rgba(0,255,209,0.6)', letterSpacing: '0.1em' }}>PUT EVERY PROJECT ON GITHUB WITH A README · RECRUITERS WILL CHECK</span>
            </div>
          </div>
        )}

        {tab === 'notes' && (
          <div>
            <p className="mono" style={{ fontSize: 8, color: 'var(--w20)', letterSpacing: '0.14em', marginBottom: 14 }}>MARKDOWN · AUTO-SAVED TO INDEXEDDB · YOUR DEVICE ONLY</p>
            <NoteEditor topicId={topic.id} sessionId={sessionId} note={note} onSave={(id, md) => onNoteChange?.(id, md)} />
          </div>
        )}
      </div>
    </div>
  );
}
