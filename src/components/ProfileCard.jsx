import { useEffect, useRef } from 'react';
import SkillRadar from './SkillRadar';
import XPSystem from './XPSystem';

export default function ProfileCard({ analysis, onReset }) {
  const { name, experienceLevel, yearsOfExperience, domain, learningStyle, education,
    knownTopicIds, estimatedWeeksToComplete, profileSummary, recommendedCertifications, personalizedPhases } = analysis;

  const levelColors = { junior: '#3fb950', mid: '#d29922', senior: '#6366f1' };
  const levelGlows  = { junior: '#3fb95044', mid: '#d2992244', senior: '#6366f144' };
  const styleEmojis = { visual: '🎨', handson: '🛠️', reading: '📚', video: '🎬' };
  const styleLabels = { visual: 'Visual Learner', handson: 'Hands-On Builder', reading: 'Deep Reader', video: 'Video Learner' };

  const partialTopicIds = personalizedPhases?.flatMap(p => p.topics.filter(t => t.status === 'partial').map(t => t.id)) || [];

  const cardRef = useRef(null);

  // Tilt on mouse move
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const onMove = e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      card.style.transform = `perspective(1000px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg)`;
    };
    const onLeave = () => { card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)'; };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave); };
  }, []);

  return (
    <div ref={cardRef} style={styles.card} className="animate-slideUp glass-strong">
      {/* Glowing border line on top */}
      <div style={{ ...styles.topBar, background: `linear-gradient(90deg, ${levelColors[experienceLevel]}, #6366f1, #06b6d4)` }} />

      <div style={styles.layout}>
        {/* LEFT COLUMN */}
        <div style={styles.left}>
          {/* Avatar */}
          <div style={{ ...styles.avatarRing, boxShadow: `0 0 0 2px ${levelColors[experienceLevel]}, 0 0 24px ${levelGlows[experienceLevel]}` }}>
            <div style={{ ...styles.avatar, background: `linear-gradient(135deg, ${levelColors[experienceLevel]}44, ${levelColors[experienceLevel]}22)` }}>
              <span style={styles.avatarText}>{name ? name[0].toUpperCase() : '👤'}</span>
            </div>
          </div>

          <div style={styles.nameSection}>
            <h2 style={styles.name}>{name || 'DevOps Learner'}</h2>
            <div style={styles.pills}>
              <span style={{ ...styles.pill, background: `${levelColors[experienceLevel]}22`, color: levelColors[experienceLevel], border: `1px solid ${levelColors[experienceLevel]}55` }}>
                {experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)} Level
              </span>
              {yearsOfExperience && <span style={styles.pillGray}>{yearsOfExperience}+ yrs</span>}
            </div>
          </div>

          {/* Quick stats */}
          <div style={styles.miniStats}>
            {[
              { label: 'Domain', value: domain, icon: '🏢' },
              { label: 'Style', value: `${styleEmojis[learningStyle]} ${styleLabels[learningStyle]}`, icon: null },
              { label: 'Education', value: education || 'N/A', icon: '🎓' },
              { label: 'Timeline', value: `~${estimatedWeeksToComplete} weeks`, icon: '📅' },
            ].map(({ label, value, icon }) => (
              <div key={label} style={styles.miniStat}>
                <span style={styles.miniLabel}>{label}</span>
                <span style={styles.miniValue}>{icon && `${icon} `}{value}</span>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={styles.summaryBox}>
            <p style={styles.summary}>{profileSummary}</p>
          </div>

          {/* Certs */}
          {recommendedCertifications.length > 0 && (
            <div>
              <p style={styles.certLabel}>🏆 Recommended Certifications</p>
              <div style={styles.certList}>
                {recommendedCertifications.map((c, i) => (
                  <div key={i} style={styles.certItem}>
                    <span style={styles.certNum}>{i + 1}</span>
                    <span style={styles.certText}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={onReset} style={styles.resetBtn}>
            ↩ Analyze New Resume
          </button>
        </div>

        {/* RIGHT COLUMN */}
        <div style={styles.right}>
          {/* Radar */}
          <div style={styles.radarBox}>
            <p style={styles.radarTitle}>Skill Radar</p>
            <SkillRadar knownTopicIds={knownTopicIds} partialTopicIds={partialTopicIds} />
          </div>

          {/* XP */}
          <XPSystem analysis={analysis} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { borderRadius: 24, overflow: 'hidden', marginBottom: 28, position: 'relative', transition: 'transform 0.1s ease', transformStyle: 'preserve-3d' },
  topBar: { height: 3, width: '100%' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, padding: '28px 32px', '@media(maxWidth:768px)': { gridTemplateColumns: '1fr' } },
  left: { display: 'flex', flexDirection: 'column', gap: 20 },
  right: { display: 'flex', flexDirection: 'column', gap: 20 },
  avatarRing: { width: 72, height: 72, borderRadius: '50%', padding: 3, flexShrink: 0 },
  avatar: { width: '100%', height: '100%', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 28, fontWeight: 900, color: 'var(--text)' },
  nameSection: { display: 'flex', flexDirection: 'column', gap: 8 },
  name: { fontSize: 26, fontWeight: 900, color: 'var(--text)', letterSpacing: -0.5 },
  pills: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  pill: { fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 30 },
  pillGray: { fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 30, background: 'var(--surface2)', color: 'var(--text2)', border: '1px solid var(--border)' },
  miniStats: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  miniStat: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 14px' },
  miniLabel: { display: 'block', fontSize: 10, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  miniValue: { fontSize: 13, color: 'var(--text)', fontWeight: 600, lineHeight: 1.3 },
  summaryBox: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 16px' },
  summary: { color: 'var(--text2)', lineHeight: 1.7, fontSize: 14, margin: 0 },
  certLabel: { fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 8 },
  certList: { display: 'flex', flexDirection: 'column', gap: 6 },
  certItem: { display: 'flex', gap: 10, alignItems: 'center', background: 'rgba(210,153,34,0.1)', border: '1px solid rgba(210,153,34,0.3)', borderRadius: 10, padding: '8px 12px' },
  certNum: { background: '#d29922', color: '#000', width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 },
  certText: { fontSize: 13, color: 'var(--text)', fontWeight: 500 },
  resetBtn: { background: 'var(--surface)', border: '1px solid var(--border2)', color: 'var(--text2)', borderRadius: 12, padding: '10px 20px', fontSize: 13, cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', marginTop: 'auto', alignSelf: 'flex-start' },
  radarBox: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '20px', textAlign: 'center' },
  radarTitle: { fontSize: 13, fontWeight: 700, color: 'var(--text2)', marginBottom: 12, textAlign: 'left' },
};
