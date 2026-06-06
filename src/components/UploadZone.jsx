import { useRef, useState, useEffect } from 'react';
import { toast } from './Toast';
import { extractTextFromPDF } from '../utils/pdfParser';

export default function UploadZone({ onAnalyze }) {
  const [drag, setDrag]     = useState(false);
  const [pct,  setPct]      = useState(0);
  const [file, setFile]     = useState('');
  const [loading, setLoad]  = useState(false);
  const [err,  setErr]      = useState('');
  const inputRef  = useRef(null);
  const cardRef   = useRef(null);

  // 3D tilt
  useEffect(() => {
    const el = cardRef.current; if (!el) return;
    const move = e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top)  / r.height - 0.5;
      el.style.transform  = `perspective(900px) rotateX(${-py * 22}deg) rotateY(${px * 22}deg) scale(1.02)`;
      el.style.boxShadow  = `${-px * 24}px ${-py * 24}px 60px rgba(0,255,209,0.12), 0 20px 60px rgba(0,0,0,0.5)`;
      el.style.setProperty('--mx', (px + 0.5) * 100 + '%');
      el.style.setProperty('--my', (py + 0.5) * 100 + '%');
    };
    const leave = () => { el.style.transform = ''; el.style.boxShadow = ''; };
    el.addEventListener('mousemove', move); el.addEventListener('mouseleave', leave);
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); };
  }, []);

  // Ripple on click
  const ripple = e => {
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const d = document.createElement('div');
    d.className = 'ripple';
    d.style.cssText = `left:${e.clientX-r.left}px;top:${e.clientY-r.top}px;width:40px;height:40px;margin:-20px`;
    el.appendChild(d); setTimeout(() => d.remove(), 750);
  };

  const process = async f => {
    if (!f || f.type !== 'application/pdf') { setErr('Please upload a PDF file.'); return; }
    setErr(''); setFile(f.name); setLoad(true); setPct(0);
    try {
      let p = 0;
      const tick = setInterval(() => { p = Math.min(p + 9, 88); setPct(p); }, 150);
      const text = await extractTextFromPDF(f);
      clearInterval(tick); setPct(100);
      if (!text || text.length < 60) throw new Error('No readable text found. Try a text-based PDF.');
      toast.success('Resume parsed — generating your roadmap');
      setTimeout(() => { setLoad(false); onAnalyze(text); }, 350);
    } catch (e) {
      setLoad(false); setPct(0); setErr(e.message || 'Parse failed.');
      toast.error(e.message || 'Parse failed');
    }
  };

  return (
    <div ref={cardRef} style={{ position: 'relative', zIndex: 2, width: 'min(500px,88vw)', padding: '40px 44px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.09)', backdropFilter: 'blur(24px)', transformStyle: 'preserve-3d', transition: 'transform 0.08s linear, box-shadow 0.3s' }}>
      {/* Cursor glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(240px circle at var(--mx,50%) var(--my,50%), rgba(0,255,209,0.05), transparent 65%)' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <input ref={inputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => process(e.target.files[0])} />

        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <p className="mono" style={{ fontSize: 9, color: 'var(--w20)', letterSpacing: '0.16em', marginBottom: 20 }}>PARSING — {file}</p>
            <div style={{ height: 1, background: 'var(--w06)', marginBottom: 10, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: 'var(--teal)', transition: 'width 0.15s', boxShadow: '0 0 10px var(--teal)' }} />
            </div>
            <span style={{ fontFamily: 'var(--fd)', fontSize: 36, fontWeight: 900, color: 'var(--teal)' }}>{pct}%</span>
          </div>
        ) : (
          <div
            onClick={e => { ripple(e); inputRef.current?.click(); }}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); process(e.dataTransfer.files[0]); }}
            data-cursor="hot"
            style={{ border: `1px solid ${drag ? 'var(--teal)' : 'rgba(255,255,255,0.1)'}`, padding: '32px', textAlign: 'center', transition: 'border-color 0.25s, background 0.25s', background: drag ? 'rgba(0,255,209,0.04)' : 'transparent', position: 'relative', overflow: 'hidden' }}>
            <p className="mono" style={{ fontSize: 11, color: drag ? 'var(--teal)' : 'var(--w20)', letterSpacing: '0.16em', marginBottom: 10 }}>
              {drag ? '— RELEASE TO ANALYZE —' : '— DROP RESUME PDF —'}
            </p>
            <p className="mono" style={{ fontSize: 9, color: 'var(--w20)', letterSpacing: '0.12em' }}>or click to browse · PDF only · 100% local · zero upload</p>
            {err && <p className="mono" style={{ fontSize: 9, color: 'var(--coral)', marginTop: 14, letterSpacing: '0.08em' }}>ERR: {err}</p>}
          </div>
        )}

        {/* Trust indicators */}
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 18 }}>
          {[['var(--teal)', 'LOCAL DB'], ['var(--teal)', 'PRIVATE'], ['var(--teal)', 'NO SERVER']].map(([c, l]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: c, boxShadow: `0 0 6px ${c}` }} />
              <span className="mono" style={{ fontSize: 8, color: 'var(--w20)', letterSpacing: '0.14em' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
