import { useEffect, useState } from 'react';

const LEVEL_THRESHOLDS = [0, 200, 500, 900, 1400, 2000, 2800, 3800, 5000, 6500, 8500];
const LEVEL_TITLES = [
  'Script Kiddie', 'Shell Ranger', 'Container Pilot', 'K8s Cadet',
  'Pipeline Artisan', 'Cloud Architect', 'IaC Wizard', 'SRE Guardian',
  'DevSecOps Sage', 'Platform Engineer', 'DevOps Legend'
];
const BADGES = [
  { id: 'first_phase', icon: '🚀', label: 'First Steps', desc: 'Completed first phase' },
  { id: 'docker_master', icon: '🐳', label: 'Container Lord', desc: 'Mastered Docker' },
  { id: 'k8s', icon: '⎈', label: 'K8s Pilot', desc: 'Kubernetes mastered' },
  { id: 'cloud', icon: '☁️', label: 'Cloud Walker', desc: 'Cloud platform known' },
  { id: 'security', icon: '🛡️', label: 'SecOps Ranger', desc: 'DevSecOps learned' },
  { id: 'terraform', icon: '🏗️', label: 'IaC Architect', desc: 'Terraform mastered' },
  { id: 'monitoring', icon: '📊', label: 'Observability Guru', desc: 'Monitoring stack known' },
  { id: 'full', icon: '🏆', label: 'DevOps Legend', desc: 'All phases complete' },
];

function calcXP(knownTopicIds, analysis) {
  let xp = 0;
  xp += knownTopicIds.length * 150;
  if (analysis?.experienceLevel === 'mid') xp += 300;
  if (analysis?.experienceLevel === 'senior') xp += 700;
  return xp;
}

function earnedBadges(knownTopicIds) {
  const earned = [];
  if (knownTopicIds.length > 0) earned.push('first_phase');
  if (knownTopicIds.includes('docker')) earned.push('docker_master');
  if (knownTopicIds.includes('kubernetes')) earned.push('k8s');
  if (knownTopicIds.includes('aws') || knownTopicIds.includes('gcp') || knownTopicIds.includes('azure')) earned.push('cloud');
  if (knownTopicIds.includes('devsecops')) earned.push('security');
  if (knownTopicIds.includes('terraform')) earned.push('terraform');
  if (knownTopicIds.includes('monitoring')) earned.push('monitoring');
  if (knownTopicIds.length >= 10) earned.push('full');
  return earned;
}

export default function XPSystem({ analysis }) {
  const knownTopicIds = analysis?.knownTopicIds || [];
  const xp = calcXP(knownTopicIds, analysis);
  const [displayXP, setDisplayXP] = useState(0);
  const [showBadge, setShowBadge] = useState(null);

  let level = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i;
  }
  const nextLevelXP = LEVEL_THRESHOLDS[Math.min(level + 1, LEVEL_THRESHOLDS.length - 1)];
  const currentLevelXP = LEVEL_THRESHOLDS[level];
  const progress = nextLevelXP === currentLevelXP ? 100 : Math.round(((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100);

  const earned = earnedBadges(knownTopicIds);

  // Count-up animation
  useEffect(() => {
    let start = 0;
    const step = xp / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= xp) { setDisplayXP(xp); clearInterval(timer); }
      else setDisplayXP(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [xp]);

  return (
    <div style={styles.wrapper}>
      {/* Level Badge */}
      <div style={styles.levelSection}>
        <div style={styles.levelOrb}>
          <div style={styles.levelInner}>
            <span style={styles.levelNum}>{level}</span>
            <span style={styles.levelWord}>LVL</span>
          </div>
          <svg style={styles.levelRing} viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="4" />
            <circle
              cx="40" cy="40" r="34" fill="none"
              stroke="url(#xpGrad)" strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 34}`}
              strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
              transform="rotate(-90 40 40)"
              style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
            />
            <defs>
              <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div style={styles.levelInfo}>
          <div style={styles.levelTitle}>{LEVEL_TITLES[level]}</div>
          <div style={styles.xpRow}>
            <span style={styles.xpValue}>{displayXP.toLocaleString()} XP</span>
            <span style={styles.xpNext}>/ {nextLevelXP.toLocaleString()} XP to Lv.{level + 1}</span>
          </div>
          <div className="xp-bar" style={{ marginTop: 8 }}>
            <div className="xp-fill" style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#6366f1,#06b6d4)' }} />
          </div>
        </div>
      </div>

      {/* Badges */}
      <div style={styles.badgesLabel}>🏅 Achievement Badges</div>
      <div style={styles.badgesGrid}>
        {BADGES.map(badge => {
          const isEarned = earned.includes(badge.id);
          return (
            <div
              key={badge.id}
              style={{ ...styles.badge, ...(isEarned ? styles.badgeEarned : styles.badgeLocked) }}
              data-tooltip={isEarned ? badge.desc : `Locked: ${badge.desc}`}
              onClick={() => isEarned && setShowBadge(badge)}
            >
              <span style={{ fontSize: 22, filter: isEarned ? 'none' : 'grayscale(1)', opacity: isEarned ? 1 : 0.3 }}>
                {badge.icon}
              </span>
              <span style={{ fontSize: 9, textAlign: 'center', lineHeight: 1.3, marginTop: 2, color: isEarned ? 'var(--text)' : 'var(--text3)' }}>
                {badge.label}
              </span>
              {isEarned && <div style={styles.earnedDot} />}
            </div>
          );
        })}
      </div>

      {showBadge && (
        <div style={styles.badgePopup} onClick={() => setShowBadge(null)} className="animate-scaleIn">
          <span style={{ fontSize: 48 }}>{showBadge.icon}</span>
          <strong style={{ color: 'var(--text)', marginTop: 8 }}>{showBadge.label}</strong>
          <span style={{ color: 'var(--text2)', fontSize: 13 }}>{showBadge.desc}</span>
          <span style={{ color: 'var(--text3)', fontSize: 11 }}>Click to close</span>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: { padding: '20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20 },
  levelSection: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 },
  levelOrb: { position: 'relative', width: 80, height: 80, flexShrink: 0 },
  levelRing: { position: 'absolute', inset: 0, width: '100%', height: '100%' },
  levelInner: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  levelNum: { fontSize: 26, fontWeight: 900, color: 'var(--accent)', lineHeight: 1 },
  levelWord: { fontSize: 9, color: 'var(--text3)', letterSpacing: 2, fontWeight: 600 },
  levelInfo: { flex: 1 },
  levelTitle: { fontSize: 18, fontWeight: 800, background: 'linear-gradient(135deg,#6366f1,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 4 },
  xpRow: { display: 'flex', gap: 8, alignItems: 'baseline' },
  xpValue: { fontSize: 20, fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--mono)' },
  xpNext: { fontSize: 12, color: 'var(--text3)' },
  badgesLabel: { fontSize: 12, color: 'var(--text2)', fontWeight: 600, marginBottom: 10, letterSpacing: 0.5 },
  badgesGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 },
  badge: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 6px', borderRadius: 12, cursor: 'pointer', transition: 'transform 0.2s', position: 'relative' },
  badgeEarned: { background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)' },
  badgeLocked: { background: 'var(--bg4)', border: '1px solid var(--border)', cursor: 'default' },
  earnedDot: { width: 6, height: 6, borderRadius: '50%', background: '#3fb950', position: 'absolute', top: 6, right: 6, boxShadow: '0 0 6px #3fb950' },
  badgePopup: { position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(8,12,20,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999, cursor: 'pointer' },
};
