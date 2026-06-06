import { useState, useRef, useEffect } from 'react';
import NoteEditor from './NoteEditor';

const STYLE_CFG = {
  visual:  { emoji:'🎨', label:'VISUAL',   color:'#a970ff' },
  handson: { emoji:'🛠',  label:'HANDS-ON', color:'var(--acid)' },
  reading: { emoji:'📖', label:'READING',  color:'var(--ice)' },
  video:   { emoji:'▶',  label:'VIDEO',    color:'#ff4500' },
};
const RES_ICON = { book:'▸ BOOK',docs:'▸ DOCS',course:'▸ COURSE',interactive:'▸ LAB',practice:'▸ PRACTICE',tutorial:'▸ GUIDE',video:'▸ VIDEO',visual:'▸ VISUAL',reference:'▸ REF' };

const STATUS_COL={ known:'var(--acid)', partial:'var(--ice)', todo:'rgba(255,255,255,0.2)' };
const DIFF_COL  ={ beginner:'var(--acid)',intermediate:'var(--ice)',advanced:'var(--ember)' };
const PRI_COL   ={ high:'var(--ember)',medium:'var(--ice)',low:'var(--acid)' };

export default function TopicDetail({ topic, phaseColor, learningStyle, sessionId, note='', checkedIndices=[], onNoteChange, onChecklistChange }) {
  const [open, setOpen]    = useState(false);
  const [tab,  setTab]     = useState('path');
  const cardRef            = useRef(null);

  /* 3D hover tilt on topic card */
  useEffect(() => {
    const el = cardRef.current; if (!el) return;
    const move = e => {
      const r=el.getBoundingClientRect(), px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
      el.style.setProperty('--mx',px*100+'%'); el.style.setProperty('--my',py*100+'%');
    };
    el.addEventListener('mousemove',move);
    return ()=>el.removeEventListener('mousemove',move);
  },[]);

  const sc  = STYLE_CFG[learningStyle]||STYLE_CFG.handson;
  const pct = topic.subtopics.length ? Math.round(checkedIndices.length/topic.subtopics.length*100) : 0;
  const hasNote = !!(note?.trim());

  const toggle = i => {
    const next = checkedIndices.includes(i) ? checkedIndices.filter(x=>x!==i) : [...checkedIndices,i];
    onChecklistChange?.(topic.id, next);
  };

  const TABS = [
    {id:'path',  lbl:`${sc.emoji} PATH`},
    {id:'list',  lbl:`LIST (${topic.subtopics.length})`},
    {id:'links', lbl:`LINKS (${topic.resources.length})`},
    {id:'proj',  lbl:`PROJECTS`},
    {id:'notes', lbl:`NOTES${hasNote?' ●':''}`},
  ];

  return (
    <div ref={cardRef} className="phase-tile"
      style={{ position:'relative', overflow:'hidden',
        borderBottom:'1px solid rgba(255,255,255,0.06)',
        background:open?`${phaseColor}06`:'rgba(255,255,255,0.02)',
      }}>
      {/* Hover glow — Active Theory card bloom */}
      <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:0,
        background:`radial-gradient(220px circle at var(--mx,50%) var(--my,50%), ${phaseColor}09, transparent 65%)`,
        opacity:1,
      }}/>

      {/* Topic header row */}
      <div style={{position:'relative',zIndex:1,display:'flex',alignItems:'flex-start',gap:12,padding:'16px 18px',cursor:'pointer'}}
        onClick={()=>setOpen(o=>!o)} data-cursor="hot">

        {/* Status dot */}
        <div style={{width:7,height:7,borderRadius:'50%',background:STATUS_COL[topic.status],
          marginTop:6,flexShrink:0,
          boxShadow:topic.status==='known'?`0 0 7px ${STATUS_COL[topic.status]}`:'none',
          transition:'box-shadow 0.3s',
        }}/>

        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6,flexWrap:'wrap'}}>
            <span style={{fontFamily:'var(--font-d)',fontWeight:600,fontSize:14,color:open?'var(--acid)':'rgba(255,255,255,0.88)',letterSpacing:'-0.01em',transition:'color 0.2s'}}>
              {topic.title}
            </span>
            {hasNote && <span className="label" style={{fontSize:8,color:'var(--ice)',letterSpacing:'0.12em'}}>NOTE</span>}
          </div>

          <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
            <span className="label" style={{fontSize:8,color:'var(--ghost3)'}}>{topic.estimatedHours}H</span>
            <span className="label" style={{fontSize:8,color:DIFF_COL[topic.difficulty]}}>{topic.difficulty.toUpperCase()}</span>
            {topic.status!=='known'&&<span className="label" style={{fontSize:8,color:PRI_COL[topic.priority]}}>{topic.priority.toUpperCase()} PRIORITY</span>}
            {checkedIndices.length>0&&<span className="label" style={{fontSize:8,color:'var(--acid)'}}>{checkedIndices.length}/{topic.subtopics.length} DONE</span>}
          </div>

          {/* Subtopic preview pills */}
          {!open && (
            <div style={{display:'flex',gap:4,flexWrap:'wrap',marginTop:8}}>
              {topic.subtopics.slice(0,3).map((s,i)=>(
                <span key={i} className="label" style={{
                  fontSize:8,color:checkedIndices.includes(i)?'var(--acid)':'var(--ghost3)',
                  background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.06)',
                  borderRadius:2,padding:'2px 7px',maxWidth:170,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
                  textDecoration:checkedIndices.includes(i)?'line-through':'none',transition:'all 0.2s',
                }}>
                  {s.split('(')[0].trim()}
                </span>
              ))}
              {topic.subtopics.length>3&&<span className="label" style={{fontSize:8,color:'var(--ghost3)',padding:'2px 4px'}}>+{topic.subtopics.length-3}</span>}
            </div>
          )}
        </div>

        <div style={{fontFamily:'var(--font-m)',fontSize:9,color:'var(--ghost3)',transition:'transform 0.3s',transform:open?'rotate(180deg)':'none',flexShrink:0,marginTop:4}}>▼</div>
      </div>

      {/* Expanded content */}
      {open && (
        <div style={{position:'relative',zIndex:1,borderTop:`1px solid ${phaseColor}33`,animation:'fadeUp 0.35s var(--ease-out) both'}}
          onClick={e=>e.stopPropagation()}>

          {/* Tab bar */}
          <div style={{display:'flex',gap:0,borderBottom:'1px solid rgba(255,255,255,0.06)',overflowX:'auto'}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)}
                className="label" style={{
                  fontSize:9,letterSpacing:'0.12em',padding:'11px 16px',background:'none',border:'none',
                  borderBottom:tab===t.id?`1px solid ${phaseColor}`:'1px solid transparent',
                  color:tab===t.id?'rgba(255,255,255,0.9)':'var(--ghost3)',
                  transition:'color 0.15s,border-color 0.15s',marginBottom:'-1px',whiteSpace:'nowrap',
                }}>
                {t.lbl}
              </button>
            ))}
          </div>

          <div style={{padding:'20px 18px 20px 28px'}}>

            {/* PATH */}
            {tab==='path'&&(
              <div className="af">
                <div style={{background:`${phaseColor}0a`,border:`1px solid ${phaseColor}22`,borderLeft:`2px solid ${phaseColor}`,padding:'14px 16px',marginBottom:14,borderRadius:'0 2px 2px 0'}}>
                  <div className="label" style={{fontSize:9,color:sc.color,marginBottom:8}}>{sc.emoji} {sc.label} PATH — PERSONALIZED FOR YOU</div>
                  <p style={{fontSize:13,color:'var(--ghost5)',lineHeight:1.75}}>{topic.personalizedStyle||topic.teachingMethod?.[learningStyle]}</p>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:6}}>
                  {Object.entries(topic.teachingMethod||{}).map(([style,text])=>{
                    const cfg=STYLE_CFG[style]; if(!cfg) return null;
                    const active=style===learningStyle;
                    return(
                      <div key={style} style={{padding:'12px',background:active?`${phaseColor}08`:'rgba(255,255,255,0.02)',border:`1px solid ${active?phaseColor+'33':'rgba(255,255,255,0.06)'}`,borderRadius:2,opacity:active?1:0.55}}>
                        <div className="label" style={{fontSize:8,color:active?cfg.color:'var(--ghost3)',marginBottom:6}}>{cfg.emoji} {cfg.label}{active?' ← YOU':''}</div>
                        <p style={{fontSize:11,color:'var(--ghost4)',lineHeight:1.6,margin:0}}>{text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* LIST */}
            {tab==='list'&&(
              <div className="af">
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                  <span className="label" style={{fontSize:8,color:'var(--ghost3)'}}>CLICK TO MARK · AUTO-SAVED TO INDEXEDDB</span>
                  <span className="label" style={{fontSize:8,color:pct===100?'var(--acid)':'var(--ghost4)'}}>{pct}%</span>
                </div>
                <div className="bar" style={{marginBottom:16}}>
                  <div style={{height:'100%',width:`${pct}%`,background:'var(--acid)',transition:'width 0.4s var(--ease-out)',boxShadow:pct===100?'0 0 8px var(--acid)':''}}/>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:4}}>
                  {topic.subtopics.map((s,i)=>{
                    const done=checkedIndices.includes(i);
                    return(
                      <div key={i} onClick={()=>toggle(i)} data-cursor="hot"
                        style={{display:'flex',gap:10,alignItems:'flex-start',padding:'10px 12px',
                        background:done?'rgba(200,255,0,0.05)':'rgba(255,255,255,0.02)',
                        border:`1px solid ${done?'rgba(200,255,0,0.25)':'rgba(255,255,255,0.05)'}`,
                        borderRadius:2,cursor:'pointer',transition:'all 0.15s'}}>
                        <div style={{width:14,height:14,borderRadius:2,border:`1px solid ${done?'var(--acid)':'rgba(255,255,255,0.2)'}`,
                          background:done?'var(--acid)':'transparent',flexShrink:0,marginTop:2,
                          display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s'}}>
                          {done&&<span style={{fontSize:9,color:'#000',fontWeight:900}}>✓</span>}
                        </div>
                        <span style={{fontSize:12,color:done?'var(--ghost3)':'var(--ghost5)',textDecoration:done?'line-through':'none',lineHeight:1.5,transition:'all 0.15s'}}>{s}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* LINKS */}
            {tab==='links'&&(
              <div className="af" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))',gap:4}}>
                {topic.resources.map((r,i)=>(
                  <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                    data-cursor="hot"
                    style={{display:'flex',gap:12,alignItems:'center',padding:'13px',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:2,textDecoration:'none',transition:'all 0.2s'}}
                    onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.borderColor=phaseColor+'55';}}
                    onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.02)';e.currentTarget.style.borderColor='rgba(255,255,255,0.05)';}}>
                    <span className="label" style={{fontSize:8,color:phaseColor,letterSpacing:'0.1em',flexShrink:0}}>{RES_ICON[r.type]||'▸'}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,color:'var(--ghost5)',fontFamily:'var(--font-d)',fontWeight:500,marginBottom:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.title}</div>
                      <div className="label" style={{fontSize:8,color:'var(--ghost3)'}}>{r.type.toUpperCase()}</div>
                    </div>
                    <span style={{fontSize:12,color:'var(--ghost3)',flexShrink:0}}>↗</span>
                  </a>
                ))}
              </div>
            )}

            {/* PROJECTS */}
            {tab==='proj'&&(
              <div className="af" style={{display:'flex',flexDirection:'column',gap:4}}>
                {topic.projects.map((p,i)=>(
                  <div key={i} style={{display:'flex',gap:16,padding:'16px',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:2}}>
                    <span className="label" style={{fontSize:11,color:phaseColor,fontWeight:700,flexShrink:0,marginTop:2}}>0{i+1}</span>
                    <div style={{flex:1}}>
                      <p style={{fontSize:13,color:'var(--ghost5)',lineHeight:1.65,marginBottom:10}}>{p}</p>
                      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                        {['PORTFOLIO','GITHUB-WORTHY','INTERVIEW READY'].map(tag=>(
                          <span key={tag} className="label" style={{fontSize:8,color:'var(--ghost3)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:2,padding:'2px 7px'}}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{padding:'12px 14px',background:'rgba(200,255,0,0.04)',border:'1px solid rgba(200,255,0,0.15)',borderRadius:2}}>
                  <span className="label" style={{fontSize:8,color:'rgba(200,255,0,0.55)'}}>PUT EVERY PROJECT ON GITHUB WITH A README · RECRUITERS WILL CHECK</span>
                </div>
              </div>
            )}

            {/* NOTES */}
            {tab==='notes'&&(
              <div className="af">
                <div className="label" style={{fontSize:8,color:'var(--ghost3)',marginBottom:14}}>MARKDOWN · AUTO-SAVED TO INDEXEDDB · STAYS ON YOUR DEVICE</div>
                <NoteEditor topicId={topic.id} sessionId={sessionId} note={note} onSave={(id,md)=>onNoteChange?.(id,md)}/>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
