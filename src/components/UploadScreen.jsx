import { useState, useRef, useEffect } from 'react';
import { extractTextFromPDF } from '../utils/pdfParser';
import ParticleCanvas from './ParticleCanvas';
import TerminalLoader from './TerminalLoader';
import ThemeToggle from './ThemeToggle';

const STATS = [
  { value: '8', label: 'Learning Phases' },
  { value: '15+', label: 'Core Topics' },
  { value: '100+', label: 'Curated Resources' },
  { value: '0', label: 'API Keys Needed' },
];

const TECH_TAGS = ['Linux', 'Docker', 'Kubernetes', 'Terraform', 'AWS', 'GCP', 'Azure', 'CI/CD', 'Prometheus', 'Grafana', 'Ansible', 'Vault', 'Istio', 'ArgoCD', 'Helm', 'GitOps'];

export default function UploadScreen({ onAnalyze }) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [showTerminal, setShowTerminal] = useState(false);
  const [pendingText, setPendingText] = useState(null);
  const fileRef = useRef(null);

  // Typewriter headline
  const [typed, setTyped] = useState('');
  const headline = 'Cloud & DevOps Roadmap';
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setTyped(headline.slice(0, ++i));
      if (i >= headline.length) clearInterval(t);
    }, 60);
    return () => clearInterval(t);
  }, []);

  async function handleFile(file) {
    if (!file) return;
    if (file.type !== 'application/pdf') { setError('Only PDF files are supported.'); return; }
    setError('');
    setFileName(file.name);
    setLoading(true);
    try {
      const text = await extractTextFromPDF(file);
      if (!text || text.length < 50) throw new Error('PDF has no extractable text. Try a text-based PDF.');
      setPendingText(text);
      setLoading(false);
      setShowTerminal(true);
    } catch (e) {
      setError(e.message || 'Failed to parse PDF.');
      setLoading(false);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  return (
    <div style={styles.page}>
      <ParticleCanvas />

      {/* Top nav */}
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          <span style={styles.logoText}>DevOps<span style={styles.logoAccent}>Path</span></span>
        </div>
        <div style={styles.navRight}>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={styles.navLink}>GitHub ↗</a>
          <ThemeToggle />
        </div>
      </nav>

      <main style={styles.main}>
        {/* Hero */}
        <div style={styles.heroSection} className="animate-slideUp">
          <div style={styles.badge} className="animate-borderGlow">
            🤖 AI-Powered • Rule-Based • 100% Private
          </div>

          <h1 style={styles.title}>
            Your Personalized<br />
            <span className="gradient-text">{typed}</span>
            <span style={styles.cursor} className="animate-pulse">|</span>
          </h1>

          <p style={styles.subtitle}>
            Upload your resume → Instant skill gap analysis → Personalized learning path
            with curated resources, real projects & certification roadmap — built just for you.
          </p>

          {/* Stats row */}
          <div style={styles.statsRow}>
            {STATS.map(({ value, label }) => (
              <div key={label} style={styles.statItem}>
                <span style={styles.statValue}>{value}</span>
                <span style={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Drop Zone */}
        <div
          style={{ ...styles.dropzone, ...(dragging ? styles.dropzoneActive : {}), ...(loading ? styles.dropzoneLoading : {}) }}
          className="animate-scaleIn glass"
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !loading && fileRef.current.click()}
        >
          <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />

          {loading ? (
            <div style={styles.loadingState}>
              <div style={styles.spinnerRing}>
                <div style={styles.spinnerInner} />
              </div>
              <p style={styles.loadingTitle}>Extracting text from PDF…</p>
              <p style={styles.loadingFile}>{fileName}</p>
            </div>
          ) : (
            <div style={styles.dropContent}>
              <div style={{ ...styles.uploadOrb, ...(dragging ? styles.uploadOrbActive : {}) }}>
                <span style={styles.uploadIcon}>{dragging ? '📂' : '📄'}</span>
              </div>
              <p style={styles.dropTitle}>{dragging ? 'Release to analyze!' : 'Drop your resume PDF here'}</p>
              <p style={styles.dropSub}>or click to browse • PDF only • parsed 100% in your browser</p>
              <div style={styles.ctaRow}>
                <button style={styles.ctaBtn} type="button">
                  <span>Choose PDF File</span>
                  <span style={styles.ctaArrow}>→</span>
                </button>
              </div>
              {error && (
                <div style={styles.errorBox} className="animate-slideUp">
                  <span>⚠️</span> {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Scrolling tech tags */}
        <div style={styles.tagsWrapper}>
          <div style={styles.tagsTrack}>
            {[...TECH_TAGS, ...TECH_TAGS].map((tag, i) => (
              <span key={i} style={styles.techTag}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Feature cards */}
        <div style={styles.features}>
          {[
            { icon: '🎯', title: 'Skill Gap Analysis', desc: 'Know exactly which topics to learn next based on your current skills', color: '#6366f1' },
            { icon: '🧠', title: 'Learning Style Detection', desc: 'Visual, hands-on, reading, or video — your style auto-detected from resume', color: '#8b5cf6' },
            { icon: '🛠️', title: 'Real Portfolio Projects', desc: 'Impress interviewers with 2-3 production-grade projects per topic', color: '#06b6d4' },
            { icon: '🏆', title: 'Cert Roadmap', desc: 'CKA, AWS SAA, Terraform Associate — in the optimal order for you', color: '#10b981' },
            { icon: '📅', title: 'Timeline Planner', desc: 'Visual Gantt-style timeline showing your week-by-week progression', color: '#f59e0b' },
            { icon: '🎮', title: 'XP & Badges', desc: 'Gamified progress tracking with levels, XP points, and achievement badges', color: '#ec4899' },
          ].map(({ icon, title, desc, color }, i) => (
            <div
              key={title}
              style={{ ...styles.featureCard, animationDelay: `${i * 0.08}s`, '--card-color': color }}
              className="animate-slideUp glass"
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'; e.currentTarget.style.boxShadow = `0 20px 40px ${color}22, 0 0 0 1px ${color}44`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <div style={{ ...styles.featureIconWrap, background: `${color}22`, boxShadow: `0 0 20px ${color}33` }}>
                <span style={styles.featureIcon}>{icon}</span>
              </div>
              <h3 style={{ ...styles.featureTitle, color: 'var(--text)' }}>{title}</h3>
              <p style={styles.featureDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Terminal loading overlay */}
      {showTerminal && (
        <TerminalLoader
          fileName={fileName}
          onComplete={() => { setShowTerminal(false); onAnalyze(pendingText); }}
        />
      )}

      <style>{`
        @keyframes scrollLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', position: 'relative', overflowX: 'hidden' },
  nav: { position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', background: 'rgba(8,12,20,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' },
  logo: { display: 'flex', alignItems: 'center', gap: 8 },
  logoIcon: { fontSize: 22, filter: 'drop-shadow(0 0 8px #6366f1)' },
  logoText: { fontSize: 20, fontWeight: 900, color: 'var(--text)', letterSpacing: -0.5 },
  logoAccent: { color: '#6366f1' },
  navRight: { display: 'flex', alignItems: 'center', gap: 20 },
  navLink: { color: 'var(--text2)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' },
  main: { maxWidth: 900, margin: '0 auto', padding: '60px 24px 80px', position: 'relative', zIndex: 1 },
  heroSection: { textAlign: 'center', marginBottom: 50 },
  badge: { display: 'inline-block', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc', borderRadius: 30, padding: '8px 22px', fontSize: 13, fontWeight: 600, marginBottom: 28, letterSpacing: 0.3 },
  title: { fontSize: 'clamp(32px,6vw,62px)', fontWeight: 900, lineHeight: 1.1, color: 'var(--text)', marginBottom: 20, letterSpacing: -1 },
  cursor: { color: '#6366f1', marginLeft: 2 },
  subtitle: { fontSize: 'clamp(15px,2vw,19px)', color: 'var(--text2)', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 36px' },
  statsRow: { display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 24px', minWidth: 100 },
  statValue: { fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg,#6366f1,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 },
  statLabel: { fontSize: 11, color: 'var(--text3)', marginTop: 4, fontWeight: 500 },
  dropzone: { borderRadius: 24, border: '2px dashed var(--border2)', cursor: 'pointer', transition: 'all 0.3s', marginBottom: 32, padding: '60px 40px', textAlign: 'center' },
  dropzoneActive: { borderColor: '#6366f1', boxShadow: '0 0 40px rgba(99,102,241,0.4)', transform: 'scale(1.01)' },
  dropzoneLoading: { cursor: 'default' },
  loadingState: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 },
  spinnerRing: { width: 64, height: 64, position: 'relative' },
  spinnerInner: { width: '100%', height: '100%', border: '3px solid var(--border)', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', boxShadow: '0 0 20px rgba(99,102,241,0.4)' },
  loadingTitle: { fontSize: 18, fontWeight: 700, color: 'var(--text)' },
  loadingFile: { fontSize: 13, color: 'var(--text3)', fontFamily: 'var(--mono)' },
  dropContent: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 },
  uploadOrb: { width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', marginBottom: 8 },
  uploadOrbActive: { background: 'linear-gradient(135deg,rgba(99,102,241,0.4),rgba(6,182,212,0.2))', boxShadow: '0 0 30px rgba(99,102,241,0.5)', transform: 'scale(1.1)' },
  uploadIcon: { fontSize: 36, filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.5))' },
  dropTitle: { fontSize: 22, fontWeight: 800, color: 'var(--text)' },
  dropSub: { fontSize: 14, color: 'var(--text3)' },
  ctaRow: { marginTop: 8 },
  ctaBtn: { display: 'flex', alignItems: 'center', gap: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px 32px', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 24px rgba(99,102,241,0.4)', transition: 'all 0.2s' },
  ctaArrow: { fontSize: 18, transition: 'transform 0.2s' },
  errorBox: { background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 10, padding: '10px 16px', color: '#f85149', fontSize: 13, display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 },
  tagsWrapper: { overflow: 'hidden', marginBottom: 48, maskImage: 'linear-gradient(90deg,transparent,black 10%,black 90%,transparent)' },
  tagsTrack: { display: 'flex', gap: 12, animation: 'scrollLeft 25s linear infinite', width: 'max-content' },
  techTag: { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: 30, padding: '6px 16px', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 },
  features: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 },
  featureCard: { borderRadius: 20, padding: '24px', cursor: 'default', transition: 'transform 0.25s, box-shadow 0.25s' },
  featureIconWrap: { width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  featureIcon: { fontSize: 24 },
  featureTitle: { fontSize: 16, fontWeight: 700, marginBottom: 6 },
  featureDesc: { fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 },
};
