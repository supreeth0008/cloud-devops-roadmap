import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WebGLCanvas from './WebGLCanvas';
import UploadZone  from './UploadZone';
import { toast }   from './Toast';

gsap.registerPlugin(ScrollTrigger);

/* ── Animated counter ─────────────────────────── */
function Counter({ to, suffix = '', delay = 0 }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; obs.disconnect();
      let s = null, dur = 1800;
      setTimeout(() => {
        const step = ts => {
          if (!s) s = ts;
          const p = Math.min((ts - s) / dur, 1);
          setV(Math.floor(p * p * to));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }, delay);
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, delay]);
  return <span ref={ref}>{v}{v === to ? suffix : ''}</span>;
}

/* ── Section bead progress dots ──────────────── */
function ProgressBeads({ active, total, onClick }) {
  return (
    <div className="progress-beads">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`bead${i === active ? ' active' : i < active ? ' done' : ''}`}
          onClick={() => onClick(i)} data-cursor="hot" />
      ))}
    </div>
  );
}

/* ── Ticker strip ─────────────────────────────── */
const TAGS = ['LINUX','DOCKER','KUBERNETES','TERRAFORM','AWS','GCP','AZURE','CI/CD','PROMETHEUS','GRAFANA','ANSIBLE','VAULT','ISTIO','ARGO CD','HELM','GITOPS','TRIVY','FALCO','OPA','LOKI','JAEGER'];

function Ticker() {
  return (
    <div style={{ overflow: 'hidden', borderTop: '1px solid var(--w06)', padding: '12px 0', WebkitMaskImage: 'linear-gradient(90deg,transparent,black 6%,black 94%,transparent)' }}>
      <div style={{ display: 'flex', animation: 'marquee 36s linear infinite', width: 'max-content' }}>
        {[...TAGS, ...TAGS].map((tag, i) => (
          <span key={i} className="mono" style={{ fontSize: 10, color: 'var(--w20)', letterSpacing: '0.18em', padding: '0 24px', flexShrink: 0 }}>
            {tag}<span style={{ paddingLeft: 24, color: 'rgba(0,255,209,0.25)' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Main HomePage ────────────────────────────── */
export default function HomePage({ onAnalyze }) {
  const scrollRef   = useRef(null);
  const [activeSection, setActiveSection] = useState(0);
  const TOTAL_SECTIONS = 3;

  // GSAP scroll-triggered text reveals
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero headline — each word slides up on load
      gsap.from('.hero-word', {
        y: 80, opacity: 0, stagger: 0.12, duration: 1.1, ease: 'power3.out', delay: 0.3
      });
      gsap.from('.hero-sub', { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.9 });
      gsap.from('.hero-cta', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 1.2 });
      gsap.from('.hero-stats', { y: 20, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out', delay: 1.5 });
    });
    return () => ctx.revert();
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sections = scrollRef.current?.querySelectorAll('.snap-section');
    if (!sections) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && e.intersectionRatio > 0.5) {
          setActiveSection(Number(e.target.dataset.idx));
        }
      });
    }, { threshold: 0.5, root: scrollRef.current });
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const scrollTo = idx => {
    const sections = scrollRef.current?.querySelectorAll('.snap-section');
    if (sections?.[idx]) sections[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Magnetic button
  useEffect(() => {
    const btn = document.querySelector('[data-mag-home]'); if (!btn) return;
    const mo = e => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      btn.style.transform = `translate(${dx * 0.36}px,${dy * 0.36}px)`;
    };
    const ml = () => { btn.style.transform = 'translate(0,0)'; };
    btn.addEventListener('mousemove', mo); btn.addEventListener('mouseleave', ml);
    return () => { btn.removeEventListener('mousemove', mo); btn.removeEventListener('mouseleave', ml); };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <WebGLCanvas />
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 65% at 50% 60%, transparent, rgba(11,11,11,0.72) 100%)' }} />

      <ProgressBeads active={activeSection} total={TOTAL_SECTIONS} onClick={scrollTo} />

      <div ref={scrollRef} className="scroll-container" style={{ position: 'relative', zIndex: 10 }}>

        {/* ══ SECTION 0 — HERO ══ */}
        <div className="snap-section" data-idx="0" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {/* Top bar */}
          <header style={{ padding: '26px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--w20)', letterSpacing: '0.22em' }}>DEVOPSPATH_v5</span>
            <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: 10, color: 'var(--w20)', letterSpacing: '0.14em' }}>CLOUD · DEVOPS · ROADMAP</span>
              <a href="https://github.com/supreeth0008/cloud-devops-roadmap" target="_blank" rel="noopener noreferrer"
                className="mono" data-cursor="link"
                style={{ fontSize: 10, color: 'var(--w35)', letterSpacing: '0.14em', textDecoration: 'none', borderBottom: '1px solid var(--w10)', paddingBottom: 1, transition: 'color 0.2s, border-color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--teal)'; e.currentTarget.style.borderColor = 'var(--teal)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--w35)'; e.currentTarget.style.borderColor = 'var(--w10)'; }}>
                GITHUB ↗
              </a>
            </div>
          </header>

          {/* Hero content */}
          <div style={{ padding: '0 60px', maxWidth: 960, margin: '0 auto', width: '100%' }}>
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
              <div style={{ width: 28, height: 1, background: 'var(--teal)' }} />
              <span className="mono" style={{ fontSize: 10, color: 'var(--teal)', letterSpacing: '0.2em' }}>UPLOAD RESUME — GET YOUR PERSONALIZED ROADMAP</span>
            </div>

            {/* Giant headline — word by word */}
            <h1 style={{ fontFamily: 'var(--fd)', fontWeight: 900, fontSize: 'clamp(64px,10.5vw,148px)', lineHeight: 0.88, letterSpacing: '-0.045em', marginBottom: 32, overflow: 'hidden' }}>
              <div style={{ overflow: 'hidden' }}><span className="hero-word" style={{ display: 'block' }}>YOUR</span></div>
              <div style={{ overflow: 'hidden' }}><span className="hero-word" style={{ display: 'block', WebkitTextStroke: '1.5px rgba(240,237,232,0.22)', color: 'transparent' }}>CLOUD</span></div>
              <div style={{ overflow: 'hidden' }}><span className="hero-word" style={{ display: 'block', color: 'var(--teal)' }}>PATH.</span></div>
            </h1>

            <p className="hero-sub" style={{ fontSize: 16, color: 'var(--w35)', lineHeight: 1.8, maxWidth: 420, marginBottom: 52 }}>
              Drop your résumé. In seconds — a personalized 8-phase roadmap with skill gaps mapped, certifications sequenced, and learning style matched.
            </p>

            {/* Magnetic CTA */}
            <div data-mag-home className="mag-btn hero-cta" style={{ display: 'inline-flex', cursor: 'pointer', transition: 'transform 0.4s var(--ease)' }}
              onClick={() => scrollTo(1)}>
              <span>ANALYZE MY RESUME</span>
              <span style={{ fontSize: 16 }}>↓</span>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 52, marginTop: 72 }}>
              {[{ to: 8, s: '', l: 'PHASES' }, { to: 15, s: '+', l: 'TOPICS' }, { to: 100, s: '+', l: 'RESOURCES' }, { to: 0, s: '', l: 'SERVERS' }].map(({ to, s, l }, i) => (
                <div key={l} className="stat-block hero-stats"
                  onMouseEnter={e => { e.currentTarget.querySelector('.stat-n').style.color = 'var(--teal)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                  onMouseLeave={e => { e.currentTarget.querySelector('.stat-n').style.color = 'var(--cream)'; e.currentTarget.style.transform = ''; }}
                  style={{ transition: 'transform 0.35s var(--ease)' }}>
                  <span className="stat-n" style={{ transition: 'color 0.3s' }}>
                    {to === 0 ? '0' : <Counter to={to} suffix={s} delay={i * 150} />}
                  </span>
                  <span className="stat-l">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <div style={{ padding: '0 60px 32px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, var(--teal))' }} />
            <span className="mono" style={{ fontSize: 9, color: 'var(--w20)', letterSpacing: '0.18em' }}>SCROLL TO UPLOAD</span>
          </div>

          <Ticker />
        </div>

        {/* ══ SECTION 1 — UPLOAD (Antigravity) ══ */}
        <div className="snap-section" data-idx="1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 60px', overflow: 'hidden', position: 'relative' }}>
          {/* Section-local antigravity particles */}
          <AGParticles />

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginBottom: 48 }}>
            <p className="mono" style={{ fontSize: 9, color: 'var(--w20)', letterSpacing: '0.22em', marginBottom: 14 }}>MOVE YOUR CURSOR — FEEL THE FIELD — DROP YOUR PDF</p>
            <h2 style={{ fontFamily: 'var(--fd)', fontWeight: 900, fontSize: 'clamp(36px,5.5vw,72px)', letterSpacing: '-0.04em', lineHeight: 1, color: 'var(--cream)' }}>
              Upload your résumé<br /><span style={{ color: 'var(--teal)' }}>here</span>
            </h2>
          </div>

          <UploadZone onAnalyze={onAnalyze} />

          <div style={{ position: 'absolute', bottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 2 }}>
            <span className="mono" style={{ fontSize: 9, color: 'var(--w20)', letterSpacing: '0.16em' }}>SCROLL TO SEE HOW IT WORKS</span>
            <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, var(--teal), transparent)' }} />
          </div>
        </div>

        {/* ══ SECTION 2 — HOW IT WORKS ══ */}
        <div className="snap-section" data-idx="2" style={{ display: 'flex', alignItems: 'center', padding: '0 60px', overflow: 'hidden' }}>
          <HowItWorks />
        </div>

      </div>
    </div>
  );
}

/* ── Antigravity canvas (section 1 local) ─── */
function AGParticles() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    let pts, raf;
    const COLS = ['#00FFD1', '#FF6B4A', '#F0EDE8', '#00ccaa'];
    const init = () => {
      const W = cv.width = cv.offsetWidth, H = cv.height = cv.offsetHeight;
      pts = Array.from({ length: 180 }, () => {
        const x = Math.random() * W, y = Math.random() * H;
        return { x, y, ox: x, oy: y, vx: 0, vy: 0, r: 1.2 + Math.random() * 2, col: COLS[0 | Math.random() * 4], mass: 0.4 + Math.random() * 0.7 };
      });
    };
    init(); window.addEventListener('resize', init);

    let lx = -999, ly = -999;
    const onMove = e => {
      const r = cv.getBoundingClientRect();
      lx = e.clientX - r.left; ly = e.clientY - r.top;
    };
    window.addEventListener('mousemove', onMove);

    const RDIST = 155, RF = 0.65, RET = 0.022, FRIC = 0.86;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const W = cv.offsetWidth, H = cv.offsetHeight;
      if (cv.width !== W || cv.height !== H) init();
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p, i) => {
        const dx = lx - p.x, dy = ly - p.y, d = Math.hypot(dx, dy);
        if (d < RDIST && d > 0.5) { const f = (RDIST - d) / RDIST * RF; p.vx -= dx / d * f / p.mass; p.vy -= dy / d * f / p.mass; }
        p.vx += (p.ox - p.x) * RET; p.vy += (p.oy - p.y) * RET;
        p.vx *= FRIC; p.vy *= FRIC; p.x += p.vx; p.y += p.vy;
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], dd = Math.hypot(p.x - q.x, p.y - q.y);
          if (dd < 80) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.strokeStyle = `rgba(0,255,209,${(1 - dd / 80) * 0.07})`; ctx.lineWidth = 0.5; ctx.stroke(); }
        }
        const glow = d < RDIST ? (1 - d / RDIST) : 0;
        ctx.shadowColor = p.col; ctx.shadowBlur = glow * 18;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r + glow * p.r * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = p.col + (glow > 0.08 ? 'ff' : '48'); ctx.fill(); ctx.shadowBlur = 0;
      });
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', init); window.removeEventListener('mousemove', onMove); };
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
}

/* ── How It Works section ─────────────────── */
function HowItWorks() {
  const steps = [
    { n: '01', icon: '📄', title: 'Drop your PDF', body: 'Upload your resume. Our pure-JS parser reads it locally — nothing leaves your browser, ever.' },
    { n: '02', icon: '🧠', title: 'Instant Analysis', body: '100+ keywords scanned. Experience level detected. Domain identified. Learning style inferred. All in under a second.' },
    { n: '03', icon: '🗺️', title: 'Your Roadmap', body: '8 phases, 15+ topics, curated resources, real projects — all personalized to your exact background and gaps.' },
    { n: '04', icon: '🗄️', title: 'Saved Locally', body: 'Sessions, notes, and checklists saved to IndexedDB on your device. Zero servers. Zero tracking. Zero cost.' },
  ];
  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: 56 }}>
        <p className="mono" style={{ fontSize: 9, color: 'var(--w20)', letterSpacing: '0.2em', marginBottom: 14 }}>HOW IT WORKS</p>
        <h2 style={{ fontFamily: 'var(--fd)', fontWeight: 900, fontSize: 'clamp(32px,5vw,64px)', letterSpacing: '-0.04em', lineHeight: 1, color: 'var(--cream)' }}>
          Four steps.<br /><span style={{ color: 'var(--teal)' }}>Under a second.</span>
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }}>
        {steps.map((s, i) => (
          <div key={s.n}
            style={{ padding: '28px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--w06)', position: 'relative', overflow: 'hidden', transition: 'border-color 0.3s, background 0.3s' }}
            data-cursor="hot"
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal40)'; e.currentTarget.style.background = 'rgba(0,255,209,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--w06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <span className="mono" style={{ fontSize: 9, color: 'var(--teal)', letterSpacing: '0.16em' }}>{s.n}</span>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
            </div>
            <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 18, color: 'var(--cream)', marginBottom: 10, letterSpacing: '-0.02em' }}>{s.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--w35)', lineHeight: 1.75 }}>{s.body}</p>
            {/* Top accent line */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, var(--teal), transparent)`, opacity: 0.6 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
