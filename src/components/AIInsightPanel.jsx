import { useState, useEffect } from 'react';

function buildInsights(a) {
  const { experienceLevel, domain, knownTopicIds, learningStyle, estimatedWeeksToComplete, quickWins } = a;
  const out = [];

  if (knownTopicIds.length >= 5) out.push({ tag:'STRENGTH', col:'var(--acid)',  title:`${knownTopicIds.length} Topics Already Mapped`, body:`You're ahead of ~80% of engineers starting this path. Your existing skills are anchors — build outward from them, not backwards. Depth over breadth from here.` });
  else if (knownTopicIds.length >= 2) out.push({ tag:'STRENGTH', col:'var(--acid)',  title:`${knownTopicIds.length} Known Topics Found`, body:`A real foundation exists. The roadmap prioritizes learning that connects directly to what you already know for maximum momentum.` });
  else out.push({ tag:'COLD START', col:'var(--ice)', title:'Blank Canvas Detected', body:`No known DevOps topics — that's an advantage. No bad habits. Follow the roadmap in order and you'll build the cleanest mental model possible.` });

  const styles = {
    handson: { tag:'LEARNING STYLE', col:'var(--acid)',  title:'Hands-On Builder Detected', body:'Resume shows "built", "deployed", "implemented" — you learn by doing. Start every topic with its Projects section first, then the docs. Use AWS/GCP free tier daily.' },
    visual:  { tag:'LEARNING STYLE', col:'var(--acid)',  title:'Visual Thinker Detected',  body:'Draw architecture diagrams before writing any code. Excalidraw → draw.io. Watch animated explainers first, then replicate the exact setup in a lab environment.' },
    reading: { tag:'LEARNING STYLE', col:'var(--acid)',  title:'Deep Reader Detected',     body:'Read official docs and whitepapers before touching labs. Annotate as you go. Write a one-page summary of every topic to lock in knowledge via teaching yourself.' },
    video:   { tag:'LEARNING STYLE', col:'var(--acid)',  title:'Video Learner Detected',   body:'Structured playlists only — TechWorld with Nana, NetworkChuck, Adrian Cantrill. Watch at 1.5×, pause at every demo, replicate it immediately. No passive watching.' },
  };
  out.push(styles[learningStyle]||styles.handson);

  const shortcuts = {
    'Backend Development':  { tag:'SHORTCUT', col:'var(--violet)', title:'Skip Phase 1 Programming', body:'You already write code — skip the language basics entirely. Your path: Docker → Kubernetes → CI/CD → Cloud. Your coding background makes the learning curve 3× faster.' },
    'Frontend Development': { tag:'SHORTCUT', col:'var(--violet)', title:'Focus: Docker + CI/CD + CDN', body:'Docker, GitHub Actions CI/CD, and AWS S3/CloudFront are your highest-leverage tools. K8s is valuable context but not critical for most frontend workflows.' },
    'Data Engineering':     { tag:'SHORTCUT', col:'var(--violet)', title:'Terraform + Cloud First', body:'Terraform, AWS (S3, Athena, EMR), and monitoring are your force multipliers. K8s for Spark and Airflow workloads will make you rare in the market.' },
    'Machine Learning':     { tag:'SHORTCUT', col:'var(--violet)', title:'K8s for ML Serving', body:'Focus: Kubernetes (model serving), Terraform, and monitoring (model drift). AWS SageMaker + Kubeflow is your specific north star. Skip general DevOps topics that don\'t touch ML infra.' },
    'Security':             { tag:'SHORTCUT', col:'var(--violet)', title:'DevSecOps First', body:'Jump to Phase 7 DevSecOps, then work backwards through K8s to understand what you\'re securing. Your security background is a massive differentiator in SRE and platform engineering.' },
  };
  if (shortcuts[domain]) out.push(shortcuts[domain]);

  if (estimatedWeeksToComplete > 30) out.push({ tag:'TIMELINE', col:'var(--ice)', title:`~${estimatedWeeksToComplete} Weeks — Plan in Sprints`, body:'Break into 3-month milestones. Each milestone should end with one certification. Daily consistency (2h/day) beats weekend cramming. Set a non-negotiable daily calendar block.' });
  else if (estimatedWeeksToComplete > 0) out.push({ tag:'TIMELINE', col:'var(--ice)', title:`~${estimatedWeeksToComplete} Weeks to Job-Ready`, body:'2-3 focused hours daily. Treat it like a second job. The compound effect hits hard around week 8 — most people quit before then. Don\'t.' });

  if (quickWins?.length > 0) out.push({ tag:'QUICK WIN', col:'var(--ember)', title:`Start: "${quickWins[0].title}"`, body:`You're partially familiar — completing it today is your fastest path to momentum, XP, and proving real progress to yourself and others. Do this today, not next week.` });

  return out;
}

export default function AIInsightPanel({ analysis }) {
  const [visible, setVisible] = useState(0);
  const items = buildInsights(analysis);

  useEffect(() => {
    const t = setInterval(() => setVisible(v => Math.min(v + 1, items.length)), 180);
    return () => clearInterval(t);
  }, []);

  const BORDER = { 'var(--acid)':'rgba(200,255,0,0.15)', 'var(--ice)':'rgba(0,212,255,0.15)', 'var(--violet)':'rgba(169,112,255,0.15)', 'var(--ember)':'rgba(255,69,0,0.15)' };

  return (
    <div>
      <div style={{marginBottom:44}}>
        <div className="label" style={{fontSize:9,color:'var(--ghost3)',letterSpacing:'0.18em',marginBottom:12}}>ANALYSIS · REAL-TIME · BASED ON YOUR RESUME</div>
        <h2 style={{fontFamily:'var(--font-d)',fontSize:'clamp(28px,4vw,48px)',fontWeight:900,color:'rgba(255,255,255,0.9)',letterSpacing:'-0.03em',lineHeight:1}}>Insights</h2>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:2}}>
        {items.slice(0,visible).map((ins,i)=>(
          <div key={i} className="asl" style={{animationDelay:`${i*0.06}s`,padding:'22px 24px',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',borderLeft:`3px solid ${ins.col}`,position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,pointerEvents:'none',background:`linear-gradient(90deg,${BORDER[ins.col]||'rgba(200,255,0,0.06)'},transparent 40%)`,zIndex:0}}/>
            <div style={{position:'relative',zIndex:1}}>
              <div style={{display:'flex',gap:12,alignItems:'baseline',marginBottom:10}}>
                <span className="label" style={{fontSize:9,color:ins.col,letterSpacing:'0.18em',flexShrink:0}}>{ins.tag}</span>
                <h3 style={{fontFamily:'var(--font-d)',fontSize:18,fontWeight:700,color:'rgba(255,255,255,0.9)',letterSpacing:'-0.01em',lineHeight:1.2}}>{ins.title}</h3>
              </div>
              <p style={{fontSize:13,color:'var(--ghost4)',lineHeight:1.78,margin:0}}>{ins.body}</p>
            </div>
          </div>
        ))}
        {visible<items.length&&(
          <div style={{padding:'14px 24px'}} className="label"><span style={{color:'var(--ghost3)',animation:'pulseDot 1.2s infinite'}}>ANALYZING…</span></div>
        )}
      </div>
    </div>
  );
}
