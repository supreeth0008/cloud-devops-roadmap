import { useState } from 'react';
import { toast } from './Toast';

function buildMD(a) {
  let md=`# Cloud & DevOps Roadmap — ${a.name||'Anonymous'}\n\n> ${a.experienceLevel} · ${a.domain} · ~${a.estimatedWeeksToComplete}w · ${a.learningStyle} learner\n\n---\n\n`;
  (a.personalizedPhases||[]).forEach(p=>{
    md+=`## ${p.icon} ${p.title}\n\n${p.description}\n\n`;
    p.topics.forEach(t=>{
      md+=`### ${t.status==='known'?'✅':t.status==='partial'?'⚡':'☐'} ${t.title} — ${t.estimatedHours}h\n\n${t.description}\n\n`;
      md+=`**Subtopics:**\n${t.subtopics.map(s=>`- ${s}`).join('\n')}\n\n`;
      md+=`**Resources:**\n${t.resources.map(r=>`- [${r.title}](${r.url}) *(${r.type})*`).join('\n')}\n\n`;
      md+=`**Projects:**\n${t.projects.map((p,i)=>`${i+1}. ${p}`).join('\n')}\n\n`;
    });
  });
  if(a.recommendedCertifications?.length) md+=`## 🏆 Certifications\n\n${a.recommendedCertifications.map((c,i)=>`${i+1}. ${c}`).join('\n')}\n`;
  return md;
}
function buildCSV(a) {
  const rows=[['Phase','Topic','Status','Hours','Priority','Difficulty']];
  (a.personalizedPhases||[]).forEach(p=>p.topics.forEach(t=>rows.push([p.title,t.title,t.status,t.estimatedHours,t.priority,t.difficulty])));
  return rows.map(r=>r.map(c=>`"${c}"`).join(',')).join('\n');
}
function dl(content,filename,mime) {
  const blob=new Blob([content],{type:mime}), url=URL.createObjectURL(blob);
  Object.assign(document.createElement('a'),{href:url,download:filename}).click();
  URL.revokeObjectURL(url);
}

export default function StudyPlanExport({ analysis }) {
  const [busy,setBusy]=useState(null), [done,setDone]=useState(null);
  const go=async type=>{
    setBusy(type); await new Promise(r=>setTimeout(r,500));
    if(type==='md')   dl(buildMD(analysis),  'devops-roadmap.md',  'text/markdown');
    if(type==='csv')  dl(buildCSV(analysis), 'devops-roadmap.csv', 'text/csv');
    if(type==='json') dl(JSON.stringify({name:analysis.name,level:analysis.experienceLevel,domain:analysis.domain,knownTopics:analysis.knownTopicIds,weeks:analysis.estimatedWeeksToComplete,certs:analysis.recommendedCertifications},null,2),'devops-roadmap.json','application/json');
    if(type==='link') await navigator.clipboard.writeText(window.location.href);
    setBusy(null); setDone(type); toast.success(`${type==='link'?'Link copied':'Downloaded'}`);
    setTimeout(()=>setDone(null),2500);
  };

  const BTNS=[
    {id:'md',  col:'var(--acid)',   lbl:'MARKDOWN',  sub:'.md — GitHub ready'  },
    {id:'csv', col:'var(--ice)',    lbl:'CSV',        sub:'.csv — Spreadsheet'  },
    {id:'json',col:'var(--violet)', lbl:'JSON',       sub:'.json — Raw data'    },
    {id:'link',col:'var(--ember)',  lbl:'COPY LINK',  sub:'Share this app'      },
  ];

  return (
    <div>
      <div style={{marginBottom:44}}>
        <div className="label" style={{fontSize:9,color:'var(--ghost3)',letterSpacing:'0.18em',marginBottom:12}}>EXPORT · CLIENT-SIDE · NO SERVER</div>
        <h2 style={{fontFamily:'var(--font-d)',fontSize:'clamp(28px,4vw,48px)',fontWeight:900,color:'rgba(255,255,255,0.9)',letterSpacing:'-0.03em',lineHeight:1}}>Export</h2>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:1,marginBottom:24}}>
        {BTNS.map(btn=>{
          const iD=done===btn.id, iL=busy===btn.id;
          return(
            <button key={btn.id} onClick={()=>go(btn.id)} disabled={!!busy}
              data-cursor="hot"
              style={{textAlign:'left',padding:'26px 22px',background:iD?'rgba(200,255,0,0.05)':'rgba(255,255,255,0.02)',
              border:`1px solid ${iD?'rgba(200,255,0,0.3)':'rgba(255,255,255,0.07)'}`,
              position:'relative',overflow:'hidden',transition:'all 0.25s',cursor:'pointer'}}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.borderColor='rgba(255,255,255,0.14)';}}
              onMouseLeave={e=>{e.currentTarget.style.background=iD?'rgba(200,255,0,0.05)':'rgba(255,255,255,0.02)';e.currentTarget.style.borderColor=iD?'rgba(200,255,0,0.3)':'rgba(255,255,255,0.07)';}}>
              <div className="label" style={{fontSize:11,fontWeight:500,letterSpacing:'0.12em',marginBottom:8,color:iD?'var(--acid)':btn.col}}>
                {iD?'✓ DONE':iL?'…':btn.lbl}
              </div>
              <div className="label" style={{fontSize:8,color:'var(--ghost3)'}}>{btn.sub}</div>
            </button>
          );
        })}
      </div>

      <div className="label" style={{fontSize:8,color:'var(--ghost3)',letterSpacing:'0.12em',lineHeight:2}}>
        ALL FILES GENERATED CLIENT-SIDE IN YOUR BROWSER.<br/>
        NOTHING SENT TO ANY SERVER. EVERYTHING IS YOURS.
      </div>
    </div>
  );
}
