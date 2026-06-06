import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      onClick={() => setDark(d => !d)}
      style={styles.btn}
      title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      <span style={styles.track}>
        <span style={{ ...styles.thumb, transform: dark ? 'translateX(0)' : 'translateX(22px)' }}>
          {dark ? '🌙' : '☀️'}
        </span>
      </span>
    </button>
  );
}

const styles = {
  btn: { background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
  track: { display: 'flex', alignItems: 'center', width: 50, height: 28, background: 'var(--bg4)', border: '1px solid var(--border2)', borderRadius: 99, padding: '3px', transition: 'background 0.3s' },
  thumb: { width: 22, height: 22, borderRadius: '50%', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' },
};
