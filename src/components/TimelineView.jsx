import { useState } from 'react';

export default function TimelineView({ phases, startPhaseIndex }) {
  const [hov, setHov] = useState(null);
  const total = (phases||[]).reduce((s,p)=>s+p.estimatedWeeks,0);

  return (
    <div>
      <div style={{marginBottom:44}}>
        <div className="label" style={{fontSize:9,color:'var(--ghost3)',letterSpacing:'0.18em',marginBottom:12}}>GANTT · WEEK-BY-WEEK · {total} TOTAL WEEKS</div>
        <h2 style={{fontFamily:'var(--font-d)',fontSize:'clamp(28px,4vw,48px)',fontWeight:900,color:'rgba(255,255,255,0.9)',letterSpacing:'-0.03em',lineHeight:1}}>Timeline</h2>
      </div>

      <div style={{overflowX:'auto',paddingBottom:8}} className="slim-scroll">
        <div style={{minWidth:680}}>
          {/* Week ruler */}
          <div style={{display:'flex',marginBottom:14,paddingLeft:180}}>
            {Array.from({length:Math.ceil(total/4)}).map((_,i)=>(
              <div key={i} style={{flex:'none',width:4*28,fontFamily:'var(--font-m)',fontSize:9,color:'var(--ghost3)',borderLeft:'1px solid rgba(255,255,255,0.06)',paddingLeft:6,letterSpacing:'0.08em'}}>
                W{i*4+1}
              </div>
            ))}
          </div>

          {/* Phase bars */}
          {(phases||[]).map((phase,i)=>{
            const off = (phases||[]).slice(0,i).reduce((s,p)=>s+p.estimatedWeeks,0);
            const pct = phase.phaseStatus==='known'?100:phase.phaseStatus==='partial'?50:0;
            const col = pct===100?'var(--acid)':pct>0?'var(--ice)':phase.color;
            const isHov = hov===i;

            return(
              <div key={phase.id} style={{display:'flex',alignItems:'center',marginBottom:6}}
                onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
                <div style={{width:180,flexShrink:0,paddingRight:16,fontFamily:'var(--font-m)',fontSize:10,color:isHov?'rgba(255,255,255,0.85)':'var(--ghost4)',letterSpacing:'0.06em',transition:'color 0.2s',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                  {phase.icon} {phase.title.replace(/Phase \d+:\s*/,'')}
                </div>
                <div style={{width:off*28,flexShrink:0}}/>
                <div style={{width:phase.estimatedWeeks*28-2,height:32,borderRadius:2,
                  background:`${col}15`,border:`1px solid ${col}${isHov?'66':'33'}`,
                  position:'relative',overflow:'hidden',flexShrink:0,
                  transition:'border-color 0.2s,box-shadow 0.2s',
                  boxShadow:isHov?`0 0 16px ${col}33`:'none',
                  cursor:'default',
                }}>
                  {/* Progress fill */}
                  <div style={{position:'absolute',inset:0,width:`${pct}%`,background:`${col}22`,transition:'width 0.8s var(--ease-out)'}}/>
                  {/* Scan line on hover */}
                  {isHov&&<div className="scan-line"/>}
                  {/* Label */}
                  <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',paddingLeft:10}}>
                    <span className="label" style={{fontSize:9,color:isHov?col:`${col}88`,letterSpacing:'0.08em',transition:'color 0.2s',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                      {phase.estimatedWeeks}W{i===startPhaseIndex?' ← START':pct===100?' ✓':''}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{display:'flex',gap:24,marginTop:28,flexWrap:'wrap'}}>
        {[['var(--acid)','COMPLETE'],['var(--ice)','IN PROGRESS'],['rgba(255,255,255,0.3)','NOT STARTED']].map(([c,l])=>(
          <div key={l} style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:20,height:2,background:c,borderRadius:1}}/>
            <span className="label" style={{fontSize:8,color:'var(--ghost3)'}}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
