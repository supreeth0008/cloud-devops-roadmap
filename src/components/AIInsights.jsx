import { useState, useEffect } from 'react';

function buildInsights(a) {
  const { experienceLevel, domain, knownTopicIds, learningStyle, estimatedWeeksToComplete, quickWins } = a;
  const out = [];
  if (knownTopicIds?.length >= 5) out.push({ tag: 'STRENGTH', c: 'var(--teal)', title: `${knownTopicIds.length} Topics Mapped`, body: `You're ahead of ~80% of engineers starting this path. Build outward from known skills — depth over breadth from here.` });
  else out.push({ tag: 'COLD START', c: 'var(--coral)', title: 'Fresh Canvas', body: `No DevOps topics found — that's fine. Follow the roadmap in order and you'll build the cleanest mental model possible.` });
  const styles = { handson: { tag: 'STYLE', c: 'var(--teal)', title: 'Hands-On Builder', body: 'Resume shows "built", "deployed", "implemented" — you learn by doing. Start every topic with Projects first, then docs.' }, visual: { tag: 'STYLE', c: 'var(--teal)', title: 'Visual Thinker', body: 'Draw architecture diagrams before code. Excalidraw → draw.io. Animated explainers first, then replicate in a lab.' }, reading: { tag: 'STYLE', c: 'var(--teal)', title: 'Deep Reader', body: 'Read official docs before labs. Annotate. Write one-page summaries to lock in knowledge.' }, video: { tag: 'STYLE', c: 'var(--teal)', title: 'Video Learner', body: 'TechWorld with Nana. 1.5× speed. Pause every demo, replicate immediately. No passive watching.' } };
  out.push(styles[learningStyle] || styles.handson);
  const shortcuts = { 'Backend Development': { tag: 'SHORTCUT', c: 'var(--coral)', title: 'Skip Phase 1 Programming', body: 'You write code — jump to Docker → K8s → CI/CD → Cloud. Coding background makes the curve 3× faster.' }, 'Frontend Development': { tag: 'SHORTCUT', c: 'var(--coral)', title: 'Focus: Docker + CI/CD', body: 'Docker, GitHub Actions, S3/CloudFront are your highest-leverage tools. K8s is good context but not critical.' }, 'Data Engineering': { tag: 'SHORTCUT', c: 'var(--coral)', title: 'Terraform + Cloud First', body: 'Terraform, AWS (S3, Athena, EMR), monitoring. K8s for Spark/Airflow will make you rare in market.' }, 'Security': { tag: 'SHORTCUT', c: 'var(--coral)', title: 'DevSecOps First', body: 'Jump to Phase 7 DevSecOps, then backwards through K8s. Your security background is a massive differentiator.' } };
  if (shortcuts[domain]) out.push(shortcuts[domain]);
  if (estimatedWeeksToComplete > 30) out.push({ tag: 'TIMELINE', c: 'var(--cream)', title: `~${estimatedWeeksToComplete} Weeks — Plan Sprints`, body: 'Break into 3-month milestones. End each with a certification. Daily 2h beats weekend cramming every time.' });
  else if (estimatedWeeksToComplete > 0) out.push({ tag: 'TIMELINE', c: 'var(--cream)', title: `~${estimatedWeeksToComplete} Weeks`, body: 'Compound effect hits hard at week 8. Most people quit at week 4. Keep the daily habit going.' });
  if (quickWins?.[0]) out.push({ tag: 'QUICK WIN', c: 'var(--coral)', title: `Start: "${quickWins[0].title}"`, body: `Partially known — completing this today gives you momentum, XP, and unlocks dependent topics immediately.` });
  return out;
}

export default function AIInsights({ analysis }) {
  const [visible, setVisible] = useState(0);
  const items = buildInsights(analysis);
  useEffect(() => { const t = setInterval(() => setVisible(v => Math.min(v + 1, items.length)), 180); return () => clearInterval(t); }, []);
  const BG = { 'var(--teal)': 'rgba(0,255,209,0.06)', 'var(--coral)': 'rgba(255,107,74,0.06)', 'var(--cream)': 'rgba(240,237,232,0.04)' };
  return (
    <div>
      <div style={{ marginBottom: 44 }}>
        <p className="mono" style={{ fontSize: 9, color: 'var(--w20)', letterSpacing: '0.18em', marginBottom: 12 }}>ANALYSIS · REAL-TIME · BASED ON YOUR RESUME</p>
        <h2 style={{ fontFamily: 'var(--fd)', fontWeight: 900, fontSize: 'clamp(28px,4vw,52px)', letterSpacing: '-0.03em', color: 'var(--cream)', lineHeight: 1 }}>
          Insights
        </h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.slice(0, visible).map((ins, i) => (
          <div key={i} style={{ animationDelay: `${i * 0.06}s`, padding: '22px 24px', background: BG[ins.c] || 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderLeft: `3px solid ${ins.c}`, animation: 'slideLeft 0.4s var(--ease) both' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', marginBottom: 10 }}>
              <span className="mono" style={{ fontSize: 9, color: ins.c, letterSpacing: '0.18em', flexShrink: 0 }}>{ins.tag}</span>
              <h3 style={{ fontFamily: 'var(--fd)', fontSize: 18, fontWeight: 700, color: 'var(--cream)', letterSpacing: '-0.01em' }}>{ins.title}</h3>
            </div>
            <p style={{ fontSize: 13, color: 'var(--w35)', lineHeight: 1.78 }}>{ins.body}</p>
          </div>
        ))}
        {visible < items.length && <div className="mono" style={{ padding: '14px 24px', fontSize: 9, color: 'var(--w20)', animation: 'blink 1s steps(1) infinite' }}>ANALYZING…</div>}
      </div>
    </div>
  );
}
