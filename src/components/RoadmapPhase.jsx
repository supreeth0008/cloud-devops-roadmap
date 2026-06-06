import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import TopicDetail from './TopicDetail';

export default function RoadmapPhase({ phase, isStart, learningStyle, sessionId, notes, checklists, onNoteChange, onChecklistChange }) {
  const [open, setOpen]     = useState(isStart);
  const [activeTopic, setActiveTopic] = useState(null);
  const prevPct = useRef(0);

  const known = phase.topics.filter(t => t.status === 'known').length;
  const pct   = Math.round((known / phase.topics.length) * 100);

  useEffect(() => {
    if (pct === 100 && prevPct.current < 100) {
      confetti({ particleCount: 80, spread: 60, origin:{ y:0.5 }, colors:['#ff4d00','#00ff88','#00d4ff'] });
    }
    prevPct.current = pct;
  }, [pct]);

  const statusColors = { known:'var(--neon)', partial:'var(--gold)', todo:'rgba(255,255,255,0.2)' };
  const diffColors   = { beginner:'var(--neon)', intermediate:'var(--gold)', advanced:'var(--ember)' };

  return (
    <div style={{ marginBottom:2 }}>
      {/* ── Phase row ── */}
      <div
        onClick={() => setOpen(o => !o)}
        data-cursor={open ? 'CLOSE' : 'OPEN'}
        style={{ display:'flex', alignItems:'center', gap:20, padding:'20px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', cursor:'pointer', userSelect:'none' }}
        onMouseEnter={e => e.currentTarget.style.paddingLeft = '8px'}
        onMouseLeave={e => e.currentTarget.style.paddingLeft = '0'}
      >
        {/* phase icon */}
        <span style={{ fontSize:20, opacity:0.7 }}>{phase.icon}</span>

        {/* title */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:700, color:'#fff', letterSpacing:'-0.01em' }}>
              {phase.title.replace(/Phase \d+:\s*/,'')}
            </span>
            {isStart && (
              <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--ember)', border:'1px solid var(--ember)', borderRadius:2, padding:'2px 8px', letterSpacing:'0.14em', animation:'pulse-glow 2s infinite' }}>
                START HERE
              </span>
            )}
          </div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'rgba(255,255,255,0.2)', marginTop:4, letterSpacing:'0.08em' }}>
            {phase.topics.length} TOPICS · ~{phase.estimatedWeeks}W
          </div>
        </div>

        {/* progress bar */}
        <div style={{ width:120, flexShrink:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.25)', letterSpacing:'0.1em' }}>{known}/{phase.topics.length}</span>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color: pct===100 ? 'var(--neon)' : 'rgba(255,255,255,0.35)', letterSpacing:'0.1em' }}>{pct}%</span>
          </div>
          <div style={{ height:2, background:'rgba(255,255,255,0.07)', borderRadius:1, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${pct}%`, background: pct===100 ? 'var(--neon)' : 'var(--ember)', borderRadius:1, transition:'width 1s cubic-bezier(0.16,1,0.3,1)', boxShadow: pct===100 ? '0 0 8px var(--neon)' : 'none' }} />
          </div>
        </div>

        {/* chevron */}
        <div style={{ fontSize:10, color:'rgba(255,255,255,0.2)', transition:'transform 0.3s', transform: open ? 'rotate(180deg)' : 'none', flexShrink:0 }}>▼</div>
      </div>

      {/* ── Topics ── */}
      {open && (
        <div style={{ padding:'24px 0 32px 0' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:1 }}>
            {phase.topics.map((topic, ti) => {
              const isActive   = activeTopic === topic.id;
              const sc         = statusColors[topic.status];
              const topicCheck = checklists?.[topic.id] || [];
              const hasNote    = !!(notes?.[topic.id]?.trim());

              return (
                <div key={topic.id}>
                  {/* topic card */}
                  <div
                    onClick={() => setActiveTopic(isActive ? null : topic.id)}
                    data-cursor={isActive ? 'CLOSE' : 'VIEW'}
                    style={{ padding:'18px 20px', background: isActive ? 'rgba(255,77,0,0.04)' : 'rgba(255,255,255,0.02)', border:`1px solid ${isActive ? 'rgba(255,77,0,0.25)' : 'rgba(255,255,255,0.04)'}`, cursor:'pointer', transition:'all 0.2s' }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  >
                    <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:10 }}>
                      {/* status dot */}
                      <div style={{ width:6, height:6, borderRadius:'50%', background:sc, boxShadow: topic.status==='known' ? `0 0 8px ${sc}` : 'none', marginTop:6, flexShrink:0 }} />
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                          <span style={{ fontFamily:'var(--font-body)', fontSize:14, fontWeight:600, color:'rgba(255,255,255,0.88)', letterSpacing:'-0.01em' }}>
                            {topic.title}
                          </span>
                          {hasNote && <span style={{ fontFamily:'var(--font-mono)', fontSize:8, color:'var(--ice)', letterSpacing:'0.1em' }}>NOTE</span>}
                        </div>
                        <div style={{ display:'flex', gap:10, marginTop:6, flexWrap:'wrap', alignItems:'center' }}>
                          <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.2)', letterSpacing:'0.1em' }}>{topic.estimatedHours}H</span>
                          <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color: diffColors[topic.difficulty], letterSpacing:'0.1em' }}>{topic.difficulty.toUpperCase()}</span>
                          {topic.status !== 'known' && (
                            <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color: topic.priority==='high' ? 'var(--ember)' : topic.priority==='medium' ? 'var(--gold)' : 'var(--neon)', letterSpacing:'0.1em' }}>
                              {topic.priority.toUpperCase()} PRIORITY
                            </span>
                          )}
                          {topicCheck.length > 0 && (
                            <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--neon)', letterSpacing:'0.1em' }}>
                              {topicCheck.length}/{topic.subtopics.length} DONE
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* subtopic preview pills */}
                    {!isActive && (
                      <div style={{ display:'flex', gap:4, flexWrap:'wrap', paddingLeft:18 }}>
                        {topic.subtopics.slice(0,3).map((s,si) => (
                          <span key={si} style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:2, padding:'2px 7px', letterSpacing:'0.06em', maxWidth:150, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {s.split('(')[0].trim()}
                          </span>
                        ))}
                        {topic.subtopics.length > 3 && (
                          <span style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'rgba(255,255,255,0.15)', padding:'2px 7px', letterSpacing:'0.06em' }}>+{topic.subtopics.length-3}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* expanded detail */}
                  {isActive && (
                    <TopicDetail topic={topic} learningStyle={learningStyle} phaseColor={phase.color}
                      sessionId={sessionId} note={notes?.[topic.id]||''} checkedIndices={topicCheck}
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
