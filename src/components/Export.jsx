import { useState } from 'react';
import { toast } from './Toast';

function buildMD(a) {
  let md = `# Cloud & DevOps Roadmap — ${a.name||'Anonymous'}\n\n> ${a.experienceLevel} · ${a.domain} · ~${a.estimatedWeeksToComplete}w\n\n---\n\n`;
  (a.personalizedPhases||[]).forEach(p => {
    md += `## ${p.icon} ${p.title}\n\n${p.description}\n\n`;
    p.topics.forEach(t => {
      md += `### ${t.status==='known'?'✅':t.status==='partial'?'⚡':'☐'} ${t.title} — ${t.estimatedHours}h\n\n${t.description}\n\n`;
      md += `**Subtopics:**\n${(t.subtopics||[]).map(s=>`- ${s}`).join('\n')}\n\n`;
      md += `**Resources:**\n${(t.resources||[]).map(r=>`- [${r.title}](${r.url}) *(${r.type})*`).join('\n')}\n\n`;
      md += `**Projects:**\n${(t.projects||[]).map((p,i)=>`${i+1}. ${p}`).join('\n')}\n\n`;
    });
  });
  return md;
}
function buildCSV(a) {
  const rows = [['Phase','Topic','Status','Hours','Priority','Difficulty']];
  (a.personalizedPhases||[]).forEach(p => p.topics.forEach(t => rows.push([p.title,t.title,t.status,t.estimatedHours,t.priority,t.difficulty])));
  return rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
}
function dl(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  Object.assign(document.createElement('a'), { href: url, download: filename }).click();
  URL.revokeObjectURL(url);
}

export default function Export({ analysis }) {
  const [busy, setBusy] = useState(null);
  const [done, setDone] = useState(null);

  const go = async type => {
    setBusy(type); await new Promise(r => setTimeout(r, 450));
    if (type === 'md')   dl(buildMD(analysis),  'devops-roadmap.md',  'text/markdown');
    if (type === 'csv')  dl(buildCSV(analysis), 'devops-roadmap.csv', 'text/csv');
    if (type === 'json') dl(JSON.stringify({ name: analysis.name, level: analysis.experienceLevel, domain: analysis.domain, knownTopics: analysis.knownTopicIds, weeks: analysis.estimatedWeeksToComplete, certs: analysis.recommendedCertifications }, null, 2), 'devops-roadmap.json', 'application/json');
    if (type === 'link') await navigator.clipboard.writeText(window.location.href);
    setBusy(null); setDone(type);
    toast.success(`${type === 'link' ? 'Link copied' : type.toUpperCase() + ' downloaded'}`);
    setTimeout(() => setDone(null), 2500);
  };

  const BTNS = [
    { id: 'md',   c: 'var(--teal)',  lbl: 'MARKDOWN',  sub: '.md — GitHub ready'  },
    { id: 'csv',  c: 'var(--coral)', lbl: 'CSV',        sub: '.csv — Spreadsheet'  },
    { id: 'json', c: '#a970ff',      lbl: 'JSON',       sub: '.json — Raw data'    },
    { id: 'link', c: 'var(--cream)', lbl: 'COPY LINK',  sub: 'Share this app'      },
  ];

  return (
    <div>
      <div style={{ marginBottom: 44 }}>
        <p className="mono" style={{ fontSize: 9, color: 'var(--w20)', letterSpacing: '0.18em', marginBottom: 12 }}>EXPORT · CLIENT-SIDE · NO SERVER</p>
        <h2 style={{ fontFamily: 'var(--fd)', fontWeight: 900, fontSize: 'clamp(28px,4vw,52px)', letterSpacing: '-0.03em', color: 'var(--cream)', lineHeight: 1 }}>Export</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 1, marginBottom: 24 }}>
        {BTNS.map(btn => {
          const iD = done === btn.id, iL = busy === btn.id;
          return (
            <button key={btn.id} onClick={() => go(btn.id)} disabled={!!busy}
              data-cursor="hot"
              style={{ textAlign: 'left', padding: '26px 22px', background: iD ? 'rgba(0,255,209,0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${iD ? 'rgba(0,255,209,0.3)' : 'var(--w06)'}`, position: 'relative', overflow: 'hidden', transition: 'all 0.25s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'var(--w20)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = iD ? 'rgba(0,255,209,0.05)' : 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = iD ? 'rgba(0,255,209,0.3)' : 'var(--w06)'; }}>
              {/* Hover fill */}
              <div style={{ position: 'absolute', inset: 0, background: btn.c === 'var(--teal)' ? 'rgba(0,255,209,0.06)' : btn.c === 'var(--coral)' ? 'rgba(255,107,74,0.06)' : 'rgba(169,112,255,0.06)', opacity: 0, transition: 'opacity 0.3s', zIndex: 0 }} className="exp-hover" />
              <p className="mono" style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', marginBottom: 8, color: iD ? 'var(--teal)' : btn.c, position: 'relative', zIndex: 1 }}>
                {iD ? '✓ DONE' : iL ? '…' : btn.lbl}
              </p>
              <p className="mono" style={{ fontSize: 9, color: 'var(--w20)', letterSpacing: '0.1em', position: 'relative', zIndex: 1 }}>{btn.sub}</p>
            </button>
          );
        })}
      </div>
      <p className="mono" style={{ fontSize: 8, color: 'var(--w20)', letterSpacing: '0.12em', lineHeight: 2 }}>
        ALL FILES GENERATED CLIENT-SIDE IN YOUR BROWSER.<br />
        NOTHING SENT TO ANY SERVER. EVERYTHING IS YOURS.
      </p>
    </div>
  );
}
