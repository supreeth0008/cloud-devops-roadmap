import { useState } from 'react';
import { formatDate } from '../utils/db';
const LVS = ['Script Kiddie','Shell Ranger','Container Pilot','K8s Cadet','Pipeline Artisan','Cloud Architect','IaC Wizard','SRE Guardian','DevSecOps Sage','Platform Engineer','DevOps Legend'];
const THRESH = [0,200,500,900,1400,2000,2800,3800,5000,6500,8500];
const getLv = xp => { let l=0; for(let i=0;i<THRESH.length;i++) if(xp>=THRESH[i]) l=i; return l; };
export default function History({ sessions=[], storageStats={}, onRemove, onWipe }) {
  const [gone, setGone] = useState(new Set());
  const [wipe, setWipe] = useState(false);
  const visible = sessions.filter(s => !gone.has(s.id));
  const remove = id => { setGone(p => new Set([...p, id])); onRemove(id); };
  return (
    <div>
      <div style={{ marginBottom: 44 }}>
        <p className="mono" style={{ fontSize: 9, color: 'var(--w20)', letterSpacing: '0.18em', marginBottom: 12 }}>LOCAL STORAGE · INDEXEDDB · YOUR DEVICE ONLY</p>
        <h2 style={{ fontFamily: 'var(--fd)', fontWeight: 900, fontSize: 'clamp(28px,4vw,52px)', letterSpacing: '-0.03em', color: 'var(--cream)', lineHeight: 1 }}>History</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 1, marginBottom: 28 }}>
        {[['STORAGE','IndexedDB + localStorage'],['LOCATION','Your browser only'],['UPLOADS','None — zero'],['LOCAL KB',`${storageStats?.localStorageKB||0} KB`],['SESSIONS',`${visible.length}`]].map(([k,v]) => (
          <div key={k} style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--w06)' }}>
            <p className="mono" style={{ fontSize: 8, color: 'var(--w20)', letterSpacing: '0.14em', marginBottom: 6 }}>{k}</p>
            <p className="mono" style={{ fontSize: 12, color: 'var(--w55)', fontWeight: 500 }}>{v}</p>
          </div>
        ))}
      </div>
      {visible.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p className="mono" style={{ color: 'var(--w20)', letterSpacing: '0.16em' }}>NO SESSIONS YET</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 24 }}>
          {visible.map((s, i) => {
            const lv = getLv(s.xp||0);
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--w06)', flexWrap: 'wrap', animation: 'slideLeft 0.3s var(--ease) both', animationDelay: `${i*0.05}s`, transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--fd)', fontSize: 15, fontWeight: 600, color: 'var(--w55)', marginBottom: 4 }}>{s.name||'Anonymous'}</p>
                  <p className="mono" style={{ fontSize: 9, color: 'var(--w20)', letterSpacing: '0.1em' }}>{s.experienceLevel?.toUpperCase()} · {s.domain}</p>
                  {s.createdAt && <p className="mono" style={{ fontSize: 8, color: 'var(--w20)', marginTop: 3, letterSpacing: '0.08em' }}>{formatDate(s.createdAt)}</p>}
                </div>
                <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
                  {[{ v: s.knownTopicIds?.length||0, l: 'TOPICS', c: 'var(--teal)' }, { v: `${s.estimatedWeeks}w`, l: 'TIMELINE', c: 'var(--coral)' }].map(({ v, l, c }) => (
                    <div key={l} style={{ textAlign: 'center' }}>
                      <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: c, lineHeight: 1 }}>{v}</div>
                      <div className="mono" style={{ fontSize: 7, color: 'var(--w20)', letterSpacing: '0.1em', marginTop: 2 }}>{l}</div>
                    </div>
                  ))}
                  <div style={{ textAlign: 'center' }}>
                    <div className="mono" style={{ fontSize: 12, fontWeight: 700, color: '#a970ff', lineHeight: 1 }}>Lv.{lv}</div>
                    <div className="mono" style={{ fontSize: 7, color: 'var(--w20)', letterSpacing: '0.08em', marginTop: 2 }}>{LVS[lv]?.toUpperCase()}</div>
                  </div>
                  <button onClick={() => remove(s.id)} data-cursor="hot"
                    className="mono" style={{ fontSize: 8, color: 'rgba(255,107,74,0.45)', background: 'none', border: '1px solid rgba(255,107,74,0.2)', borderRadius: 2, padding: '6px 12px', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.target.style.color='var(--coral)'; e.target.style.borderColor='var(--coral)'; }}
                    onMouseLeave={e => { e.target.style.color='rgba(255,107,74,0.45)'; e.target.style.borderColor='rgba(255,107,74,0.2)'; }}>
                    DELETE
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ padding: '20px', background: 'rgba(255,107,74,0.03)', border: '1px solid rgba(255,107,74,0.14)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <p className="mono" style={{ fontSize: 9, color: 'var(--coral)', letterSpacing: '0.16em', marginBottom: 6 }}>DANGER ZONE</p>
            <p style={{ fontSize: 13, color: 'var(--w35)' }}>Permanently wipe all sessions, notes, and checklists from your device.</p>
          </div>
          {!wipe ? (
            <button onClick={() => setWipe(true)} data-cursor="hot" className="mono"
              style={{ fontSize: 9, color: 'var(--coral)', background: 'none', border: '1px solid rgba(255,107,74,0.35)', borderRadius: 2, padding: '10px 20px' }}>
              WIPE ALL DATA
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: 9, color: 'var(--coral)' }}>ARE YOU SURE?</span>
              <button onClick={() => { onWipe(); setWipe(false); }} className="mono" style={{ fontSize: 9, color: '#000', background: 'var(--coral)', border: 'none', borderRadius: 2, padding: '8px 16px' }}>YES</button>
              <button onClick={() => setWipe(false)} className="mono" style={{ fontSize: 9, color: 'var(--w35)', background: 'none', border: '1px solid var(--w10)', borderRadius: 2, padding: '8px 16px' }}>CANCEL</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
