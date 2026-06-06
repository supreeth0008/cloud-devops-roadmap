import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useDB } from '../hooks/useDB';
import { toast } from './Toast';
import TopicDetail from './TopicDetail';
import AIInsightPanel from './AIInsightPanel';
import TimelineView from './TimelineView';
import HistoryPanel from './HistoryPanel';
import StudyPlanExport from './StudyPlanExport';
import WebGLCanvas from './WebGLCanvas';
import confetti from 'canvas-confetti';

/* ─── Animated counter ─────────────────────────────────────── */
function Num({ to, suffix='' }) {
  const [v,setV]=useState(0);
  useEffect(()=>{
    let s=null;
    const step=ts=>{if(!s)s=ts;const p=Math.min((ts-s)/1600,1);setV(Math.floor(p*p*to));if(p<1)requestAnimationFrame(step);};
    const t=setTimeout(()=>requestAnimationFrame(step),300);
    return()=>clearTimeout(t);
  },[to]);
  return <>{v}{v===to?suffix:''}</>;
}

/* ─── SVG Progress Ring ────────────────────────────────────── */
function Ring({ pct, size=52, stroke=4, color='var(--acid)', label='' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ display:'block', flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition:'stroke-dashoffset 1.3s var(--ease-out)', filter:`drop-shadow(0 0 4px ${color})` }} />
      {label && <text x={size/2} y={size/2} dominantBaseline="middle" textAnchor="middle" fontFamily="var(--font-m)" fontSize="9" fill={color} fontWeight="600">{label}</text>}
    </svg>
  );
}

/* ─── Skill coverage bars ──────────────────────────────────── */
const SKILL_MAP=[
  {l:'Linux',key:'linux'},{l:'Networking',key:'networking'},{l:'Docker',key:'docker'},{l:'K8s',key:'kubernetes'},
  {l:'CI/CD',key:'cicd'},{l:'Terraform',key:'terraform'},{l:'Cloud',key:'aws'},{l:'Monitoring',key:'monitoring'},
  {l:'Security',key:'devsecops'},{l:'SRE',key:'sre'},
];
function SkillStrip({analysis}) {
  const {knownTopicIds,personalizedPhases}=analysis;
  const partials=(personalizedPhases||[]).flatMap(p=>p.topics.filter(t=>t.status==='partial').map(t=>t.id));
  return (
    <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:44}}>
      {SKILL_MAP.map(({l,key})=>{
        const k=knownTopicIds.includes(key),p=partials.includes(key);
        const pct=k?100:p?52:6;
        const col=k?'var(--acid)':p?'var(--ice)':'rgba(255,255,255,0.15)';
        return(
          <div key={key} style={{flex:'1 1 80px',minWidth:72}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
              <span className="label" style={{fontSize:8,color:'var(--ghost3)'}}>{l.toUpperCase()}</span>
              <span className="mono" style={{fontSize:8,color:col}}>{pct}%</span>
            </div>
            <div className="bar"><div className="bar-fill" style={{width:`${pct}%`,background:col,boxShadow:k?`0 0 7px ${col}`:'none'}}/></div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Phase tiles — Active Theory "rack-focus bloom" ────────── */
function PhaseTiles({ phases, startPhaseIndex, learningStyle, sessionId, notes, checklists, onNoteChange, onChecklistChange }) {
  const [hovered,  setHovered]  = useState(null);
  const [expanded, setExpanded] = useState(null);
  const prevPct    = useRef({});

  const phasePct = p => {
    const k = p.topics.filter(t=>t.status==='known').length;
    return Math.round(k/p.topics.length*100);
  };

  useEffect(() => {
    phases.forEach(p => {
      const pct=phasePct(p);
      if(pct===100&&(prevPct.current[p.id]||0)<100){
        confetti({particleCount:70,spread:60,origin:{y:0.5},colors:['#c8ff00','#a970ff','#ffffff']});
        toast.success(`${p.title} complete!`);
      }
      prevPct.current[p.id]=pct;
    });
  },[phases]);

  const STATUS_COL = { known:'var(--acid)', partial:'var(--ice)', todo:'var(--ghost3)' };
  const STATUS_LBL = { known:'COMPLETE', partial:'IN PROGRESS', todo:'NOT STARTED' };
  const DIFF_COL   = { beginner:'var(--acid)', intermediate:'var(--ice)', advanced:'var(--ember)' };
  const PRI_COL    = { high:'var(--ember)', medium:'var(--ice)', low:'var(--acid)' };

  const toggleExpand = (id) => {
    setExpanded(e => e===id ? null : id);
    setHovered(null);
  };

  return (
    <div>
      {phases.map((phase,pi) => {
        const pct      = phasePct(phase);
        const isStart  = phase.id===phases[startPhaseIndex]?.id;
        const isHov    = hovered===phase.id;
        const isExp    = expanded===phase.id;
        const stCol    = STATUS_COL[phase.phaseStatus];
        const stLbl    = STATUS_LBL[phase.phaseStatus];

        return (
          <div key={phase.id} style={{marginBottom:2}}>
            {/* ── Phase header tile ── */}
            <div
              className={`phase-tile${isExp?' expanded':''}`}
              style={{
                display:'flex', alignItems:'center', gap:20, padding:'20px 24px',
                borderBottom:'1px solid rgba(255,255,255,0.06)',
                opacity: (hovered && !isHov && !isExp) ? 0.42 : 1,
                transform: (hovered && !isHov && !isExp) ? 'scale(0.988)' : 'scale(1)',
                transition:'opacity 0.3s var(--ease-out),transform 0.3s var(--ease-out),background 0.3s,border-color 0.3s',
                position:'relative',
              }}
              onMouseEnter={() => { setHovered(phase.id); }}
              onMouseLeave={() => { setHovered(null); }}
              onMouseMove={e => {
                const t=e.currentTarget,r=t.getBoundingClientRect();
                t.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
                t.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
              }}
              onClick={()=>toggleExpand(phase.id)}
              data-cursor="hot"
            >
              {/* Hover fill glow */}
              <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:0,
                background:`radial-gradient(circle at var(--mx,50%) var(--my,50%), ${phase.color}12, transparent 55%)`,
                opacity:isHov?1:0,transition:'opacity 0.3s',borderRadius:'inherit',
              }}/>

              <div style={{flexShrink:0,fontSize:22,opacity:isHov||isExp?1:0.65,transition:'opacity 0.25s,transform 0.3s',transform:isHov?'scale(1.15)':'scale(1)',position:'relative',zIndex:1}}>
                {phase.icon}
              </div>

              <div style={{flex:1,minWidth:0,position:'relative',zIndex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap',marginBottom:4}}>
                  <span style={{fontFamily:'var(--font-d)',fontWeight:700,fontSize:17,color:isExp?'var(--acid)':'rgba(255,255,255,0.9)',letterSpacing:'-0.02em',transition:'color 0.25s'}}>
                    {phase.title.replace(/Phase \d+:\s*/,'')}
                  </span>
                  {isStart && (
                    <span className="label" style={{fontSize:8,color:'var(--acid)',border:'1px solid rgba(200,255,0,0.4)',borderRadius:2,padding:'2px 8px',animation:'pulseDot 2s infinite',animationTimingFunction:'ease'}}>
                      START HERE
                    </span>
                  )}
                  <span className="label" style={{fontSize:8,color:stCol,border:`1px solid ${stCol}44`,borderRadius:2,padding:'2px 8px'}}>{stLbl}</span>
                </div>
                <span className="label" style={{fontSize:8,color:'var(--ghost3)'}}>
                  {phase.topics.length} TOPICS · ~{phase.estimatedWeeks}W
                </span>
              </div>

              <div style={{display:'flex',alignItems:'center',gap:16,flexShrink:0,position:'relative',zIndex:1}}>
                <Ring pct={pct} size={48} color={stCol} label={pct+'%'} />
                <div style={{fontFamily:'var(--font-m)',fontSize:9,color:'var(--ghost3)',transition:'transform 0.3s',transform:isExp?'rotate(180deg)':'none'}}>▼</div>
              </div>
            </div>

            {/* ── Topic grid (expanded) ── */}
            {isExp && (
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:1,padding:'1px 0 24px 0',animation:'fadeUp 0.4s var(--ease-out) both'}}>
                {phase.topics.map((topic, ti) => {
                  const topicChecked = checklists?.[topic.id]||[];
                  const hasNote = !!(notes?.[topic.id]?.trim());
                  const col = STATUS_COL[topic.status];

                  return (
                    <TopicDetail key={topic.id}
                      topic={topic} phaseColor={phase.color} learningStyle={learningStyle}
                      sessionId={sessionId}
                      note={notes?.[topic.id]||''} checkedIndices={topicChecked}
                      onNoteChange={onNoteChange} onChecklistChange={onChecklistChange}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Pill nav ─────────────────────────────────────────────── */
const TABS = [
  { id:'roadmap',  lbl:'ROADMAP',  key:'1' },
  { id:'insights', lbl:'INSIGHTS', key:'2' },
  { id:'timeline', lbl:'TIMELINE', key:'3' },
  { id:'history',  lbl:'HISTORY',  key:'4' },
  { id:'export',   lbl:'EXPORT',   key:'5' },
];

/* ─── Profile bar ──────────────────────────────────────────── */
function ProfileBar({analysis, overallPct, onReset}) {
  const {name,experienceLevel,domain,knownTopicIds,estimatedWeeksToComplete}=analysis;
  const lvlCol={junior:'var(--acid)',mid:'var(--ice)',senior:'var(--ember)'}[experienceLevel];
  return (
    <div style={{display:'flex',alignItems:'center',gap:24,padding:'18px 0 32px',borderBottom:'1px solid rgba(255,255,255,0.05)',marginBottom:44,flexWrap:'wrap'}}>
      <div>
        <div style={{fontFamily:'var(--font-d)',fontWeight:800,fontSize:22,color:'rgba(255,255,255,0.9)',letterSpacing:'-0.02em',marginBottom:8}}>
          {name||'Your Roadmap'}
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
          <span className="label" style={{fontSize:9,color:lvlCol,border:`1px solid ${lvlCol}44`,borderRadius:2,padding:'2px 9px'}}>{experienceLevel.toUpperCase()}</span>
          <span className="label" style={{fontSize:9,color:'var(--ghost4)'}}>{domain}</span>
        </div>
      </div>
      <div style={{display:'flex',gap:28,marginLeft:'auto',alignItems:'center',flexWrap:'wrap'}}>
        <Ring pct={overallPct} size={56} color='var(--acid)' label={overallPct+'%'}/>
        {[{v:knownTopicIds.length,l:'KNOWN',c:'var(--acid)'},{v:`~${estimatedWeeksToComplete}w`,l:'TIMELINE',c:'var(--ice)'}].map(({v,l,c})=>(
          <div key={l} style={{textAlign:'right'}}>
            <div style={{fontFamily:'var(--font-d)',fontSize:22,fontWeight:800,color:c,lineHeight:1}}>{v}</div>
            <div className="label" style={{fontSize:8,color:'var(--ghost3)',marginTop:4}}>{l}</div>
          </div>
        ))}
        <button onClick={onReset} data-cursor="hot"
          className="label" style={{fontSize:9,color:'var(--ghost4)',background:'none',border:'1px solid rgba(255,255,255,0.12)',borderRadius:2,padding:'9px 16px',transition:'all 0.2s'}}
          onMouseEnter={e=>{e.target.style.borderColor='var(--acid)';e.target.style.color='var(--acid)';}}
          onMouseLeave={e=>{e.target.style.borderColor='rgba(255,255,255,0.12)';e.target.style.color='var(--ghost4)';}}>
          ← NEW RESUME
        </button>
      </div>
    </div>
  );
}

/* ─── Keyboard shortcut display ────────────────────────────── */
function KeyHints() {
  return (
    <div style={{display:'flex',gap:16,alignItems:'center',flexWrap:'wrap'}}>
      {[[['1','5'],'TABS'],[['/',],'SEARCH'],[['ESC'],'CLEAR']].map(([keys,lbl],i)=>(
        <div key={i} style={{display:'flex',alignItems:'center',gap:5}}>
          {keys.map(k=><kbd key={k}>{k}</kbd>)}
          <span className="label" style={{fontSize:8,color:'var(--ghost3)'}}>{lbl}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Main RoadmapView ─────────────────────────────────────── */
export default function RoadmapView({ analysis, onReset }) {
  const [tab,    setTab]    = useState('roadmap');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const searchRef = useRef(null);
  const navRef    = useRef(null);
  const lastScrollY = useRef(0);

  const { sessionId,sessions,notes,checklists,storageStats,dbReady,updateNote,updateChecklist,removeSession,wipeAll } = useDB(analysis);

  /* Keyboard shortcuts */
  useEffect(() => {
    const h = e => {
      if (e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return;
      const t = TABS.find(t=>t.key===e.key);
      if (t) { setTab(t.id); window.scrollTo({top:0,behavior:'smooth'}); }
      if (e.key==='/'||e.key==='f') { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key==='Escape') { setSearch(''); setFilter('all'); searchRef.current?.blur(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  /* Nav scroll velocity — Active Theory pillbox feel */
  useEffect(() => {
    const nav = navRef.current; if (!nav) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const diff = window.scrollY - lastScrollY.current;
          const clamp = Math.max(-8, Math.min(8, diff));
          nav.style.transform = `translateY(${clamp > 0 ? '-2px' : '0'}) scaleX(${1 - Math.abs(clamp)*0.002})`;
          lastScrollY.current = window.scrollY;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive:true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* DB toast */
  useEffect(() => { if(dbReady&&sessionId) toast.success(`Session #${sessionId} saved locally`); }, [dbReady,sessionId]);

  const allTopics  = (analysis.personalizedPhases||[]).flatMap(p=>p.topics);
  const knownCount = allTopics.filter(t=>t.status==='known').length;
  const overallPct = allTopics.length ? Math.round(knownCount/allTopics.length*100) : 0;

  const filteredPhases = useMemo(() => {
    return (analysis.personalizedPhases||[]).map(phase => {
      let topics = [...phase.topics];
      if (search.trim()) {
        const q = search.toLowerCase();
        topics = topics.filter(t=>t.title.toLowerCase().includes(q)||t.keywords.some(k=>k.includes(q))||t.subtopics.some(s=>s.toLowerCase().includes(q)));
      }
      if (filter!=='all') topics=topics.filter(t=>t.status===filter);
      return {...phase,topics};
    }).filter(p=>p.topics.length>0);
  },[analysis.personalizedPhases,filter,search]);

  const tabContent = () => {
    switch(tab) {
      case 'roadmap': return (
        <>
          <SkillStrip analysis={analysis}/>

          {/* Filter + Search */}
          <div style={{display:'flex',gap:10,marginBottom:28,alignItems:'center',flexWrap:'wrap'}}>
            <div style={{display:'flex',gap:2}}>
              {['all','todo','partial','known'].map(f=>(
                <button key={f} onClick={()=>setFilter(f)}
                  className="label" style={{fontSize:9,letterSpacing:'0.14em',padding:'8px 14px',
                  background:filter===f?'var(--acid)':'rgba(255,255,255,0.04)',
                  border:`1px solid ${filter===f?'var(--acid)':'rgba(255,255,255,0.08)'}`,
                  borderRadius:2,color:filter===f?'#000':'var(--ghost4)',transition:'all 0.2s'}}>
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
            <div style={{flex:1,minWidth:200,display:'flex',alignItems:'center',gap:10,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:2,padding:'8px 14px'}}>
              <span className="label" style={{fontSize:9,color:'var(--ghost3)'}}>SEARCH</span>
              <input ref={searchRef} value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="kubernetes, prometheus, terraform…"
                style={{flex:1,border:'none',background:'transparent',color:'rgba(255,255,255,0.78)',fontSize:12,fontFamily:'var(--font-m)',outline:'none',letterSpacing:'0.05em'}}/>
              {search&&<button onClick={()=>setSearch('')} className="mono" style={{fontSize:9,color:'var(--ghost3)',background:'none',border:'none',padding:2}}>✕</button>}
            </div>
            <span className="label" style={{fontSize:8,color:'var(--ghost3)'}}>{filteredPhases.reduce((s,p)=>s+p.topics.length,0)} TOPICS</span>
            <KeyHints/>
          </div>

          {filteredPhases.length===0 ? (
            <div style={{textAlign:'center',padding:'80px 0'}}>
              <div className="label" style={{color:'var(--ghost3)',marginBottom:20}}>NO RESULTS</div>
              <button onClick={()=>{setSearch('');setFilter('all');}} className="label"
                style={{fontSize:9,color:'var(--acid)',background:'none',border:'1px solid var(--acid)',borderRadius:2,padding:'9px 22px'}}>
                CLEAR FILTERS
              </button>
            </div>
          ) : (
            <PhaseTiles phases={filteredPhases} startPhaseIndex={analysis.startPhaseIndex}
              learningStyle={analysis.learningStyle} sessionId={sessionId}
              notes={notes} checklists={checklists}
              onNoteChange={updateNote} onChecklistChange={updateChecklist}/>
          )}
        </>
      );
      case 'insights': return <AIInsightPanel analysis={analysis}/>;
      case 'timeline': return <TimelineView phases={analysis.personalizedPhases} startPhaseIndex={analysis.startPhaseIndex}/>;
      case 'history':  return <HistoryPanel sessions={sessions} storageStats={storageStats} onRemove={id=>{removeSession(id);toast.warn('Session deleted');}} onWipe={()=>{wipeAll();toast.error('All data wiped');}} />;
      case 'export':   return <StudyPlanExport analysis={analysis}/>;
      default: return null;
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'var(--black)',color:'rgba(255,255,255,0.85)'}}>
      <WebGLCanvas style={{opacity:0.55}}/>
      <div style={{position:'fixed',inset:0,zIndex:1,pointerEvents:'none',background:'rgba(8,8,8,0.82)'}}/>

      {/* ── PILL NAV (Active Theory scroll-velocity) ── */}
      <div style={{position:'sticky',top:0,zIndex:200,display:'flex',justifyContent:'center',padding:'14px 0',backdropFilter:'blur(28px)',background:'rgba(8,8,8,0.85)',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
        <div ref={navRef} style={{display:'flex',alignItems:'center',gap:24,maxWidth:1080,width:'100%',padding:'0 44px',transition:'transform 0.15s'}}>
          <span className="label" style={{fontSize:9,color:'var(--ghost3)',letterSpacing:'0.22em'}}>DEVOPSPATH_v4</span>

          <nav className="pill-nav" style={{margin:'0 auto'}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>{setTab(t.id);window.scrollTo({top:0,behavior:'smooth'});}}
                className={tab===t.id?'active':''}>
                {t.lbl}
                <sup>{t.key}</sup>
              </button>
            ))}
          </nav>

          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <Ring pct={overallPct} size={36} color='var(--acid)'/>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:dbReady?'var(--acid)':'rgba(255,255,255,0.2)',boxShadow:dbReady?'0 0 8px var(--acid)':'none'}}/>
              <span className="label" style={{fontSize:8,color:dbReady?'rgba(200,255,0,0.55)':'var(--ghost3)',letterSpacing:'0.12em'}}>
                {dbReady?`DB ${storageStats.localStorageKB}KB`:'SAVING…'}
              </span>
            </div>
            <button onClick={onReset} data-cursor="hot"
              className="label" style={{fontSize:8,color:'var(--ghost4)',background:'none',border:'1px solid rgba(255,255,255,0.1)',borderRadius:999,padding:'7px 16px',transition:'all 0.2s'}}
              onMouseEnter={e=>{e.target.style.borderColor='var(--acid)';e.target.style.color='var(--acid)';}}
              onMouseLeave={e=>{e.target.style.borderColor='rgba(255,255,255,0.1)';e.target.style.color='var(--ghost4)';}}>
              ← NEW RESUME
            </button>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{position:'relative',zIndex:10,maxWidth:1080,margin:'0 auto',padding:'48px 44px 80px'}}>
        <ProfileBar analysis={analysis} overallPct={overallPct} onReset={onReset}/>
        {tabContent()}
      </div>

      <footer style={{position:'relative',zIndex:10,borderTop:'1px solid rgba(255,255,255,0.04)',padding:'18px 44px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span className="label" style={{fontSize:8,color:'var(--ghost3)'}}>
          ALL DATA LOCAL · NO SERVERS · NO TRACKING · PRESS 1–5 TO SWITCH TABS · / TO SEARCH
        </span>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer"
          className="label" style={{fontSize:8,color:'var(--ghost4)',textDecoration:'none',transition:'color 0.2s'}}
          onMouseEnter={e=>e.target.style.color='var(--acid)'}
          onMouseLeave={e=>e.target.style.color='var(--ghost4)'}>
          GITHUB ↗
        </a>
      </footer>
    </div>
  );
}
