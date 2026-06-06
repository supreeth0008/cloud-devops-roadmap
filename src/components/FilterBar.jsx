export default function FilterBar({ filter, setFilter, search, setSearch, totalCount }) {
  const filters = [
    { id: 'all', label: '🗺️ All', count: null },
    { id: 'todo', label: '📖 To Learn', count: null },
    { id: 'partial', label: '⚡ In Progress', count: null },
    { id: 'known', label: '✅ Known', count: null },
  ];

  return (
    <div style={styles.wrapper}>
      <div style={styles.filterGroup}>
        {filters.map(f => (
          <button
            key={f.id}
            style={{ ...styles.pill, ...(filter === f.id ? styles.pillActive : {}) }}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div style={styles.searchWrap}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          style={styles.search}
          placeholder="Search tools, topics, skills… (e.g. 'prometheus', 'helm')"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button style={styles.clearBtn} onClick={() => setSearch('')}>✕</button>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' },
  filterGroup: { display: 'flex', gap: 6, flexWrap: 'wrap', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '6px' },
  pill: { border: 'none', background: 'transparent', color: 'var(--text2)', borderRadius: 10, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' },
  pillActive: { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' },
  searchWrap: { flex: 1, minWidth: 220, position: 'relative', display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '0 14px', transition: 'border-color 0.2s' },
  searchIcon: { fontSize: 14, marginRight: 8, flexShrink: 0 },
  search: { flex: 1, border: 'none', background: 'transparent', color: 'var(--text)', fontSize: 14, padding: '10px 0', outline: 'none', fontFamily: 'var(--font)' },
  clearBtn: { background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 13, padding: '4px', borderRadius: 6 },
};
