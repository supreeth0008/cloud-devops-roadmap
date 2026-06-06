import { useEffect, useRef, useState, useCallback } from 'react';
import WebGLCanvas from './WebGLCanvas';
import AntigravityField from './AntigravityField';
import { toast } from './Toast';

/* ─── Animated counter ─────────────────────────────────────── */
function Counter({ to, suffix = '', delay = 400, dur = 1800 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let s = null;
    const t0 = setTimeout(() => {
      const step = ts => {
        if (!s) s = ts;
        const p = Math.min((ts - s) / dur, 1);
        setV(Math.floor(p * p * to));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(t0);
  }, [to, delay, dur]);
  return <>{v}{v === to ? suffix : ''}</>;
}

/* ─── Hero headline — staggered char reveal ────────────────── */
function HeroTitle() {
  const lines = [
    { text: 'YOUR',  hollow: false },
    { text: 'CLOUD', hollow: true  },
    { text: 'PATH.',  hollow: false, color: 'var(--acid)' },
  ];
  return (
    <div style={{ fontFamily:'var(--font-d)', fontWeight:900, fontSize:'clamp(64px,10vw,148px)', lineHeight:0.88, letterSpacing:'-0.045em', marginBottom:28 }}>
      {lines.map((line, li) => (
        <div key={li} style={{ display:'block', overflow:'hidden' }}>
          <div className="au" style={{
            animationDelay: `${li * 0.1 + 0.2}s`,
            WebkitTextStroke: line.hollow ? '1px rgba(255,255,255,0.22)' : undefined,
            color: line.color || (line.hollow ? 'transparent' : 'rgba(255,255,255,0.9)'),
          }}>
            {line.text}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── PDF upload zone ──────────────────────────────────────── */
function UploadZone({ onText }) {
  const [drag,    setDrag]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [pct,     setPct]     = useState(0);
  const [fileName,setFileName]= useState('');
  const [err,     setErr]     = useState('');
  const inputRef  = useRef(null);
  const tiltRef   = useRef(null);

  /* 3D tilt */
  useEffect(() => {
    const el = tiltRef.current; if (!el) return;
    const move = e => {
      const r  = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top)  / r.height;
      const rx = (py - 0.5) * 22, ry = (0.5 - px) * 22;
      el.style.transform  = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      el.style.boxShadow  = `${-ry * 0.5}px ${rx * 0.5}px 48px rgba(200,255,0,0.18), 0 24px 60px rgba(0,0,0,0.6)`;
      el.style.setProperty('--mx', px * 100 + '%');
      el.style.setProperty('--my', py * 100 + '%');
    };
    const leave = () => {
      el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
      el.style.boxShadow = 'none';
    };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); };
  }, []);

  /* ripple */
  const ripple = e => {
    const el = e.currentTarget; const r = el.getBoundingClientRect();
    const d = document.createElement('div'); d.className = 'ripple';
    d.style.cssText = `left:${e.clientX-r.left}px;top:${e.clientY-r.top}px;width:40px;height:40px;margin:-20px`;
    el.appendChild(d); setTimeout(() => d.remove(), 720);
  };

  const process = async f => {
    if (!f || f.type !== 'application/pdf') { setErr('Please use a PDF file.'); return; }
    setErr(''); setFileName(f.name); setLoading(true); setPct(0);
    try {
      const { extractTextFromPDF } = await import('../utils/pdfParser');
      let p = 0; const tick = setInterval(() => { p = Math.min(p + 10, 88); setPct(p); }, 160);
      const text = await extractTextFromPDF(f);
      clearInterval(tick); setPct(100);
      if (!text || text.length < 60) throw new Error('No readable text found in PDF.');
      toast.success('Resume parsed — building your roadmap');
      setTimeout(() => { setLoading(false); onText(text); }, 400);
    } catch (e) {
      setLoading(false); setPct(0); setErr(e.message || 'Parse failed.');
    }
  };

  return (
    <div ref={tiltRef} style={{
      position:'relative', zIndex:2, width:'min(500px,90vw)',
      padding:'40px 44px', background:'rgba(255,255,255,0.025)',
      border:'1px solid rgba(255,255,255,0.09)',
      backdropFilter:'blur(24px)',
      transformStyle:'preserve-3d', willChange:'transform',
    }}>
      {/* card glimmer */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:1,
        background:'radial-gradient(260px circle at var(--mx,50%) var(--my,50%), rgba(200,255,0,0.045), transparent 70%)',
      }} />
      <div style={{ position:'relative', zIndex:2 }}>
        <input ref={inputRef} type="file" accept=".pdf" style={{ display:'none' }} onChange={e => process(e.target.files[0])} />

        {loading ? (
          <div style={{ textAlign:'center' }}>
            <div className="label" style={{ color:'var(--ghost4)', marginBottom:20 }}>PARSING — {fileName}</div>
            <div className="bar" style={{ marginBottom:10 }}>
              <div style={{ height:'100%', width:`${pct}%`, background:'var(--acid)', transition:'width 0.15s', boxShadow:'0 0 10px var(--acid)' }} />
            </div>
            <div style={{ fontFamily:'var(--font-m)', fontSize:28, fontWeight:700, color:'var(--acid)' }}>{pct}%</div>
          </div>
        ) : (
          <div
            onClick={e => { ripple(e); inputRef.current?.click(); }}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); process(e.dataTransfer.files[0]); }}
            data-cursor="hot"
            style={{
              border: `1px solid ${drag ? 'var(--acid)' : 'rgba(255,255,255,0.1)'}`,
              padding:'32px', textAlign:'center', position:'relative', overflow:'hidden',
              transition:'border-color 0.25s, background 0.25s',
              background: drag ? 'rgba(200,255,0,0.04)' : 'transparent',
            }}>
            {drag && <div className="scan-line" style={{ zIndex:2 }} />}
            <div className="label" style={{ color: drag ? 'var(--acid)' : 'var(--ghost3)', marginBottom:10 }}>
              {drag ? '— RELEASE TO ANALYZE —' : '— DROP RESUME PDF —'}
            </div>
            <div className="mono" style={{ fontSize:10, color:'var(--ghost3)' }}>or click · PDF only · 100% local · zero upload</div>
            {err && <div className="mono" style={{ fontSize:10, color:'var(--ember)', marginTop:12, letterSpacing:'0.08em' }}>ERR: {err}</div>}
          </div>
        )}

        {/* Trust indicators */}
        <div style={{ marginTop:18, display:'flex', gap:20, justifyContent:'center' }}>
          {[['var(--acid)','LOCAL DB'],['var(--acid)','PRIVATE'],['var(--acid)','NO SERVER']].map(([c,l]) => (
            <div key={l} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background:c, boxShadow:`0 0 6px ${c}`, animation:'pulseDot 2s infinite' }} />
              <span className="label" style={{ fontSize:8, color:'var(--ghost4)', letterSpacing:'0.16em' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Scrolling tech ticker ────────────────────────────────── */
const TAGS = ['LINUX','DOCKER','KUBERNETES','TERRAFORM','AWS','GCP','AZURE','CI/CD','PROMETHEUS','GRAFANA','ANSIBLE','HASHICORP VAULT','ISTIO','ARGO CD','HELM','GITOPS','TRIVY','FALCO','OPA','LOKI','JAEGER','OPENTELEMETRY','EKS','GKE','AKS','DATADOG','NEW RELIC','GITHUB ACTIONS','GITLAB CI'];

function Ticker() {
  return (
    <div style={{ overflow:'hidden', borderTop:'1px solid rgba(255,255,255,0.05)', padding:'13px 0',
      WebkitMaskImage:'linear-gradient(90deg,transparent,black 7%,black 93%,transparent)' }}>
      <div style={{ display:'flex', animation:'marquee 40s linear infinite', width:'max-content' }}>
        {[...TAGS,...TAGS].map((tag, i) => (
          <span key={i} className="mono" style={{ fontSize:10, color:'var(--ghost3)', letterSpacing:'0.18em', padding:'0 26px', flexShrink:0 }}>
            {tag}
            {i < TAGS.length * 2 - 1 && <span style={{ paddingLeft:26, color:'rgba(200,255,0,0.25)' }}>·</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Main VideoHome ───────────────────────────────────────── */
export default function VideoHome({ onAnalyze }) {
  const agRef = useRef(null);

  /* Magnetic button */
  useEffect(() => {
    const btns = document.querySelectorAll('[data-mag]');
    btns.forEach(btn => {
      const mo = e => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top  + r.height / 2);
        btn.style.transform = `translate(${dx * 0.35}px,${dy * 0.35}px)`;
      };
      const ml = () => { btn.style.transform = 'translate(0,0)'; };
      btn.addEventListener('mousemove', mo);
      btn.addEventListener('mouseleave', ml);
    });
  }, []);

  const scrollToUpload = () => agRef.current?.scrollIntoView({ behavior:'smooth' });

  const stats = [
    { to:8,   s:'',  l:'PHASES',    delay:600  },
    { to:15,  s:'+', l:'TOPICS',    delay:750  },
    { to:100, s:'+', l:'RESOURCES', delay:900  },
    { to:0,   s:'',  l:'SERVERS',   delay:1050 },
  ];

  return (
    <div style={{ position:'relative', background:'var(--black)', overflow:'hidden' }}>
      <WebGLCanvas />
      {/* Radial vignette */}
      <div style={{ position:'fixed', inset:0, zIndex:1, pointerEvents:'none',
        background:'radial-gradient(ellipse 80% 65% at 50% 60%, transparent, rgba(8,8,8,0.75) 100%)' }} />

      {/* ══ SECTION 1 — HERO ══ */}
      <div style={{ position:'relative', zIndex:10, minHeight:'100vh', display:'flex', flexDirection:'column' }}>
        {/* top bar */}
        <header style={{ padding:'26px 64px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span className="label" style={{ fontSize:10, color:'var(--ghost3)', letterSpacing:'0.22em' }}>DEVOPSPATH_v4</span>
          <div style={{ display:'flex', gap:32, alignItems:'center' }}>
            <span className="label" style={{ fontSize:10, color:'var(--ghost3)', letterSpacing:'0.14em' }}>CLOUD · DEVOPS · ROADMAP</span>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              className="mono" style={{ fontSize:10, color:'var(--ghost4)', letterSpacing:'0.14em', textDecoration:'none', borderBottom:'1px solid rgba(255,255,255,0.15)', paddingBottom:1, transition:'color 0.2s,border-color 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.color='var(--acid)';e.currentTarget.style.borderColor='var(--acid)';}}
              onMouseLeave={e=>{e.currentTarget.style.color='var(--ghost4)';e.currentTarget.style.borderColor='rgba(255,255,255,0.15)';}}>
              GITHUB ↗
            </a>
          </div>
        </header>

        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'0 64px', maxWidth:1040, margin:'0 auto', width:'100%' }}>
          {/* eyebrow */}
          <div className="au" style={{ display:'flex', alignItems:'center', gap:14, marginBottom:32 }}>
            <div style={{ width:28, height:1, background:'var(--acid)' }} />
            <span className="label" style={{ fontSize:10, color:'var(--acid)' }}>UPLOAD RESUME · GET PERSONALIZED ROADMAP</span>
          </div>

          <HeroTitle />

          <p className="au" style={{ fontSize:15, color:'var(--ghost4)', lineHeight:1.85, maxWidth:400, marginBottom:52, animationDelay:'0.35s' }}>
            Drop your résumé. In seconds — an 8-phase cloud & DevOps roadmap personalized to your background, skill gaps mapped, learning style matched, certifications sequenced.
          </p>

          <div className="au" data-mag style={{ alignSelf:'flex-start', animationDelay:'0.48s', cursor:'pointer' }}
            onClick={scrollToUpload}>
            <div className="mag-btn">
              <span>START YOUR ROADMAP</span>
              <span style={{ fontSize:14 }}>↓</span>
            </div>
          </div>

          {/* Stats */}
          <div className="au" style={{ display:'flex', gap:56, marginTop:72, animationDelay:'0.6s' }}>
            {stats.map(({ to, s, l, delay }) => (
              <div key={l}
                onMouseEnter={e => { e.currentTarget.querySelector('.sn').style.color='var(--acid)'; e.currentTarget.style.transform='translateY(-5px)'; }}
                onMouseLeave={e => { e.currentTarget.querySelector('.sn').style.color='#fff'; e.currentTarget.style.transform=''; }}
                style={{ transition:'transform 0.35s var(--ease-out)' }}>
                <div className="sn" style={{ fontFamily:'var(--font-d)', fontSize:48, fontWeight:900, lineHeight:1, color:'#fff', letterSpacing:'-0.04em', transition:'color 0.3s' }}>
                  {to === 0 ? '0' : <Counter to={to} suffix={s} delay={delay} />}
                </div>
                <div className="label" style={{ fontSize:8, color:'var(--ghost3)', marginTop:7 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <Ticker />
      </div>

      {/* ══ SECTION 2 — ANTIGRAVITY UPLOAD ══ */}
      <div ref={agRef} style={{ position:'relative', zIndex:10, minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'80px 64px', overflow:'hidden' }}>
        <AntigravityField count={200} repelDist={170} />

        <div style={{ position:'relative', zIndex:2, textAlign:'center', marginBottom:52 }}>
          <p className="label" style={{ fontSize:9, color:'var(--ghost3)', letterSpacing:'0.22em', marginBottom:14 }}>MOVE YOUR CURSOR · FEEL THE FIELD · DROP YOUR PDF</p>
          <h2 style={{ fontFamily:'var(--font-d)', fontWeight:900, fontSize:'clamp(32px,5vw,68px)', letterSpacing:'-0.04em', lineHeight:1.0, color:'#fff' }}>
            Upload your résumé<br />
            <span style={{ color:'var(--acid)' }}>here</span>
          </h2>
        </div>

        <UploadZone onText={onAnalyze} />

        {/* Scroll hint */}
        <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
          <span className="label" style={{ fontSize:8, color:'var(--ghost3)' }}>SCROLL FOR ROADMAP PREVIEW</span>
          <div style={{ width:1, height:32, background:'linear-gradient(to bottom, rgba(200,255,0,0.6), transparent)' }} />
        </div>
      </div>
    </div>
  );
}
