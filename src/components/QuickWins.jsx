export default function QuickWins({ quickWins }) {
  if (!quickWins || quickWins.length === 0) return null;

  return (
    <div style={styles.card} className="animate-slideUp glass">
      <div style={styles.header}>
        <div style={styles.iconBox}>⚡</div>
        <div>
          <h3 style={styles.title}>Quick Wins — Do These First</h3>
          <p style={styles.sub}>Topics you partially know. Complete them to gain XP and momentum fast.</p>
        </div>
      </div>
      <div style={styles.grid}>
        {quickWins.map((topic, i) => (
          <div key={topic.id} style={{ ...styles.item, animationDelay: `${i * 0.1}s` }} className="animate-slideUp">
            <div style={{ ...styles.rank, background: `linear-gradient(135deg, #d29922, #f59e0b)` }}>{i + 1}</div>
            <div style={styles.itemContent}>
              <div style={styles.itemTitle}>{topic.title}</div>
              <div style={styles.itemDesc}>{topic.description.slice(0, 72)}…</div>
              <div style={styles.itemMeta}>
                <span style={styles.metaChip}>⏱ {topic.estimatedHours}h</span>
                <span style={styles.metaChip}>+{topic.estimatedHours * 15} XP</span>
              </div>
            </div>
            <span style={styles.arrow}>→</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: { borderRadius: 20, padding: '22px 26px', marginBottom: 24, border: '1px solid rgba(210,153,34,0.3)', background: 'rgba(210,153,34,0.05)' },
  header: { display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 18 },
  iconBox: { width: 44, height: 44, background: 'rgba(210,153,34,0.2)', border: '1px solid rgba(210,153,34,0.4)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 },
  title: { fontSize: 17, fontWeight: 800, color: 'var(--text)', marginBottom: 3 },
  sub: { fontSize: 13, color: 'var(--text2)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 10 },
  item: { display: 'flex', gap: 12, alignItems: 'center', background: 'var(--surface)', border: '1px solid rgba(210,153,34,0.25)', borderRadius: 14, padding: '14px 16px', transition: 'transform 0.2s', cursor: 'default' },
  rank: { width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#000', flexShrink: 0 },
  itemContent: { flex: 1, minWidth: 0 },
  itemTitle: { fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 2 },
  itemDesc: { fontSize: 12, color: 'var(--text3)', lineHeight: 1.4, marginBottom: 6 },
  itemMeta: { display: 'flex', gap: 6 },
  metaChip: { fontSize: 11, background: 'rgba(210,153,34,0.15)', color: '#d29922', border: '1px solid rgba(210,153,34,0.3)', borderRadius: 20, padding: '2px 8px', fontWeight: 600 },
  arrow: { color: '#d29922', fontSize: 18, fontWeight: 700, flexShrink: 0 },
};
