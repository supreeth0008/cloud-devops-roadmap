import { useState } from 'react';
import { formatDate } from '../utils/db';

const LEVELS=['Script Kiddie','Shell Ranger','Container Pilot','K8s Cadet','Pipeline Artisan','Cloud Architect','IaC Wizard','SRE Guardian','DevSecOps Sage','Platform Engineer','DevOps Legend'];
const THRESH=[0,200,500,900,1400,2000,2800,3800,5000,6500,8500];
const getLevel=xp=>{let l=0;for(let i=0;i<THRESH.length;i++)if(xp>=THRESH[i])l=i;return l;};

export default function HistoryPanel({ sessions, storageStats, onRemove, onWipe }) {
  const [confirmWipe, setConfirmWipe] = useState(false);
  const [removed,     setRemoved]     = useState(new Set());
  const visible = (sessions||[]).filter(s=>!removed.has(s.id));
  const remove  = id => { setRemoved(p=>new Set([...p,id])); onRemove(id); };

  return (
    <div>
      <div style={{marginBottom:44}}>
        <div className="label" style={{fontSize:9,color:'var(--ghost3)',letterSpacing:'0.18em',marginBottom:12}}>LOCAL STORAGE · INDEXEDDB · YOUR DEVICE ONLY</div>
        <h2 style={{fontFamily:'var(--font-d)',fontSize:'clamp(28px,4vw,48px)',fontWeight:900,color:'rgba(255,255,255,0.9)',letterSpacing:'-0.03em',lineHeight:1}}>History</h2>
      </div>

      {/* DB info grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:1,marginBottom:28}}>
        {[['STORAGE','IndexedDB + localStorage'],['LOCATION','Your browser only'],['UPLOADS','None — zero'],['LOCAL KB',`${storageStats?.localStorageKB||0} KB`],['SESSIONS',`${visible.length}`]].map(([k,v])=>(
          <div key={k} style={{padding:'14px 16px',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)'}}>
            <div className="label" style={{fontSize:8,color:'var(--ghost3)',marginBottom:6}}>{k}</div>
            <div className="mono" style={{fontSize:12,color:'var(--ghost5)',fontWeight:500}}>{v}</div>
          </div>
        ))}
      </div>

      {visible.length===0 ? (
        <div style={{textAlign:'center',padding:'60px 0'}}>
          <div className="label" style={{color:'var(--ghost3)'}}>NO SESSIONS YET</div>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:1,marginBottom:24}}>
          {visible.map((s,i)=>{
            const lv=getLevel(s.xp||0);
            return(
              <div key={s.id} className="asl" style={{animationDelay:`${i*0.05}s`,display:'flex',alignItems:'center',gap:20,padding:'16px',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',transition:'background 0.2s,transform 0.2s',flexWrap:'wrap'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:'var(--font-d)',fontSize:15,fontWeight:600,color:'var(--ghost5)',marginBottom:4}}>{s.name||'Anonymous'}</div>
                  <div className="label" style={{fontSize:9,color:'var(--ghost3)'}}>{s.experienceLevel?.toUpperCase()} · {s.domain}</div>
                  {s.createdAt&&<div className="mono" style={{fontSize:9,color:'var(--ghost3)',marginTop:3}}>{formatDate(s.createdAt)}</div>}
                </div>
                <div style={{display:'flex',gap:18,alignItems:'center',flexShrink:0,flexWrap:'wrap'}}>
                  <div style={{textAlign:'center'}}><div className="mono" style={{fontSize:18,fontWeight:700,color:'var(--acid)',lineHeight:1}}>{s.knownTopicIds?.length||0}</div><div className="label" style={{fontSize:8,color:'var(--ghost3)',marginTop:2}}>TOPICS</div></div>
                  <div style={{textAlign:'center'}}><div className="mono" style={{fontSize:18,fontWeight:700,color:'var(--ice)',lineHeight:1}}>{s.estimatedWeeks}w</div><div className="label" style={{fontSize:8,color:'var(--ghost3)',marginTop:2}}>TIMELINE</div></div>
                  <div style={{textAlign:'center'}}><div className="mono" style={{fontSize:12,fontWeight:700,color:'var(--violet)',lineHeight:1}}>Lv.{lv}</div><div className="label" style={{fontSize:8,color:'var(--ghost3)',marginTop:2}}>{LEVELS[lv]?.toUpperCase()}</div></div>
                  <button onClick={()=>remove(s.id)} data-cursor="hot"
                    className="label" style={{fontSize:8,color:'rgba(255,69,0,0.45)',background:'none',border:'1px solid rgba(255,69,0,0.2)',borderRadius:2,padding:'6px 12px',transition:'all 0.2s'}}
                    onMouseEnter={e=>{e.target.style.color='var(--ember)';e.target.style.borderColor='var(--ember)';}}
                    onMouseLeave={e=>{e.target.style.color='rgba(255,69,0,0.45)';e.target.style.borderColor='rgba(255,69,0,0.2)';}}>
                    DELETE
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Danger zone */}
      <div style={{padding:'20px',background:'rgba(255,69,0,0.03)',border:'1px solid rgba(255,69,0,0.14)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}>
          <div>
            <div className="label" style={{fontSize:9,color:'var(--ember)',marginBottom:6}}>DANGER ZONE</div>
            <div style={{fontSize:13,color:'var(--ghost4)'}}>Permanently wipe all sessions, notes, and checklists from your device.</div>
          </div>
          {!confirmWipe ? (
            <button onClick={()=>setConfirmWipe(true)} data-cursor="hot"
              className="label" style={{fontSize:9,color:'var(--ember)',background:'none',border:'1px solid rgba(255,69,0,0.35)',borderRadius:2,padding:'10px 20px'}}>
              WIPE ALL DATA
            </button>
          ) : (
            <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
              <span className="label" style={{fontSize:9,color:'var(--ember)'}}>ARE YOU SURE?</span>
              <button onClick={()=>{onWipe();setConfirmWipe(false);}} className="label" style={{fontSize:9,color:'#000',background:'var(--ember)',border:'none',borderRadius:2,padding:'8px 16px'}}>YES, WIPE</button>
              <button onClick={()=>setConfirmWipe(false)} className="label" style={{fontSize:9,color:'var(--ghost4)',background:'none',border:'1px solid rgba(255,255,255,0.15)',borderRadius:2,padding:'8px 16px'}}>CANCEL</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
