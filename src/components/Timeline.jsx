import { useState } from 'react';
export default function Timeline({ phases = [], startPhaseIndex }) {
  const [hov, setHov] = useState(null);
  const total = phases.reduce((s, p) => s + p.estimatedWeeks, 0);
  return (
    <div>
      <div style={{ marginBottom: 44 }}>
        <p className="mono" style={{ fontSize: 9, color: 'var(--w20)', letterSpacing: '0.18em', marginBottom: 12 }}>GANTT · WEEK-BY-WEEK · {total} TOTAL WEEKS</p>
        <h2 style={{ fontFamily: 'var(--fd)', fontWeight: 900, fontSize: 'clamp(28px,4vw,52px)', letterSpacing: '-0.03em', color: 'var(--cream)', lineHeight: 1 }}>Timeline</h2>
      </div>
      <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
        <div style={{ minWidth: 680, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {phases.map((phase, i) => {
            const off = phases.slice(0, i).reduce((s, p) => s + p.estimatedWeeks, 0);
            const pct = phase.phaseStatus === 'known' ? 100 : phase.phaseStatus === 'partial' ? 50 : 0;
            const col = pct === 100 ? 'var(--teal)' : pct > 0 ? 'var(--coral)' : phase.color;
            const isH = hov === i;
            return (
              <div key={phase.id} style={{ display: 'flex', alignItems: 'center' }}
                onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
                <div style={{ width: 160, flexShrink: 0, paddingRight: 16, fontFamily: 'var(--fm)', fontSize: 10, color: isH ? 'var(--cream)' : 'var(--w35)', letterSpacing: '0.06em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', transition: 'color 0.2s' }}>
                  {phase.icon} {phase.title.replace(/Phase \d+:\s*/, '')}
                </div>
                <div style={{ width: off * 26, flexShrink: 0 }} />
                <div style={{ width: phase.estimatedWeeks * 26 - 2, height: 30, borderRadius: 2, background: `${col}15`, border: `1px solid ${col}${isH ? '66' : '33'}`, position: 'relative', overflow: 'hidden', flexShrink: 0, transition: 'border-color 0.2s, box-shadow 0.2s', boxShadow: isH ? `0 0 14px ${col}33` : 'none' }}>
                  <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: `${col}28`, transition: 'width 0.8s var(--ease)' }} />
                  {isH && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${col}, transparent)`, animation: 'scanH 2s linear infinite' }} />}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', paddingLeft: 10 }}>
                    <span className="mono" style={{ fontSize: 9, color: isH ? col : `${col}88`, letterSpacing: '0.08em', transition: 'color 0.2s', whiteSpace: 'nowrap' }}>
                      {phase.estimatedWeeks}W{i === startPhaseIndex ? ' ← START' : pct === 100 ? ' ✓' : ''}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 24, marginTop: 28, flexWrap: 'wrap' }}>
        {[['var(--teal)', 'COMPLETE'], ['var(--coral)', 'IN PROGRESS'], ['rgba(255,255,255,0.25)', 'NOT STARTED']].map(([c, l]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 20, height: 2, background: c, borderRadius: 1 }} />
            <span className="mono" style={{ fontSize: 8, color: 'var(--w20)', letterSpacing: '0.12em' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
