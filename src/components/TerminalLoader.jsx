import { useEffect, useState } from 'react';

const LINES = [
  { text: '$ analyzing resume...', delay: 0 },
  { text: '> parsing PDF content', delay: 300 },
  { text: '> detecting experience level', delay: 600 },
  { text: '> scanning skill keywords [████████░░] 80%', delay: 900 },
  { text: '> scanning skill keywords [██████████] 100%', delay: 1100 },
  { text: '> mapping to roadmap topics', delay: 1300 },
  { text: '> inferring learning style', delay: 1600 },
  { text: '> calculating skill gaps', delay: 1900 },
  { text: '> generating personalized path', delay: 2100 },
  { text: '> estimating timeline', delay: 2400 },
  { text: '✓ roadmap ready!', delay: 2700, success: true },
];

export default function TerminalLoader({ fileName, onComplete }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers = LINES.map((line, i) =>
      setTimeout(() => {
        setVisibleLines(prev => [...prev, line]);
        if (i === LINES.length - 1) {
          setTimeout(() => { setDone(true); setTimeout(onComplete, 400); }, 400);
        }
      }, line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={styles.overlay} className={done ? 'animate-fadeOut' : ''}>
      <div style={styles.terminal} className="animate-scaleIn">
        <div style={styles.titleBar}>
          <div style={styles.dots}>
            <span style={{ ...styles.dot, background: '#f85149' }} />
            <span style={{ ...styles.dot, background: '#d29922' }} />
            <span style={{ ...styles.dot, background: '#3fb950' }} />
          </div>
          <span style={styles.titleText}>roadmap-generator — {fileName || 'resume.pdf'}</span>
        </div>
        <div style={styles.body}>
          {visibleLines.map((line, i) => (
            <div key={i} style={{ ...styles.line, color: line.success ? '#3fb950' : 'var(--text)', animationDelay: `${i * 0.05}s` }} className="animate-slideUp">
              {line.success && <span style={styles.checkGlow}>✓ </span>}
              <span className="terminal">{line.success ? line.text.replace('✓ ', '') : line.text}</span>
            </div>
          ))}
          {!done && (
            <span style={styles.cursor} className="animate-pulse">█</span>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(8,12,20,0.92)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 },
  terminal: { width: '100%', maxWidth: 560, background: '#0d1117', borderRadius: 14, overflow: 'hidden', boxShadow: '0 0 0 1px rgba(99,102,241,0.3), 0 0 60px rgba(99,102,241,0.2), 0 25px 50px rgba(0,0,0,0.6)' },
  titleBar: { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: '#161b22', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  dots: { display: 'flex', gap: 6 },
  dot: { width: 12, height: 12, borderRadius: '50%', display: 'block' },
  titleText: { fontSize: 12, color: '#8b949e', fontFamily: 'var(--mono)', marginLeft: 8 },
  body: { padding: '20px 24px', minHeight: 280, display: 'flex', flexDirection: 'column', gap: 8 },
  line: { fontSize: 13, lineHeight: 1.6, display: 'flex', alignItems: 'center', gap: 4 },
  cursor: { color: '#6366f1', fontSize: 14, fontFamily: 'var(--mono)', marginTop: 4 },
  checkGlow: { color: '#3fb950', textShadow: '0 0 10px #3fb950', fontWeight: 700 },
};
