import { useEffect, useRef } from 'react';

const SKILLS = [
  { label: 'Linux', key: 'linux' },
  { label: 'Networking', key: 'networking' },
  { label: 'Containers', key: 'docker' },
  { label: 'Kubernetes', key: 'kubernetes' },
  { label: 'CI/CD', key: 'cicd' },
  { label: 'Terraform', key: 'terraform' },
  { label: 'Cloud', key: 'aws' },
  { label: 'Monitoring', key: 'monitoring' },
  { label: 'Security', key: 'devsecops' },
  { label: 'SRE', key: 'sre' },
];

export default function SkillRadar({ knownTopicIds = [], partialTopicIds = [] }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const getScore = (key) => {
    if (knownTopicIds.includes(key)) return 0.95;
    if (partialTopicIds.includes(key)) return 0.5;
    return 0.08;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const cx = size / 2, cy = size / 2;
    const r = size * 0.38;
    const n = SKILLS.length;
    let frame = 0;
    let progress = 0;

    const scores = SKILLS.map(s => getScore(s.key));

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      frame++;
      progress = Math.min(1, progress + 0.025);

      ctx.clearRect(0, 0, size, size);

      // Rings
      for (let ring = 1; ring <= 4; ring++) {
        const rr = (ring / 4) * r;
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
          const x = cx + rr * Math.cos(angle);
          const y = cy + rr * Math.sin(angle);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(99,102,241,${ring === 4 ? 0.25 : 0.1})`;
        ctx.lineWidth = ring === 4 ? 1.5 : 1;
        ctx.stroke();

        // Ring label
        const angle = -Math.PI / 2;
        const lx = cx + rr * Math.cos(angle) + 4;
        const ly = cy + rr * Math.sin(angle);
        ctx.fillStyle = 'rgba(139,148,158,0.5)';
        ctx.font = '9px Inter, sans-serif';
        ctx.fillText(`${ring * 25}%`, lx, ly);
      }

      // Spokes
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
        ctx.strokeStyle = 'rgba(99,102,241,0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Skill polygon (animated fill)
      const animated = scores.map(s => s * progress);
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const dist = r * animated[i];
        const x = cx + dist * Math.cos(angle);
        const y = cy + dist * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, 'rgba(99,102,241,0.5)');
      grad.addColorStop(0.6, 'rgba(139,92,246,0.3)');
      grad.addColorStop(1, 'rgba(6,182,212,0.1)');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#6366f1';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Dots at vertices + pulse
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const dist = r * animated[i];
        const x = cx + dist * Math.cos(angle);
        const y = cy + dist * Math.sin(angle);

        const pulse = (Math.sin(frame * 0.05 + i) + 1) / 2;

        if (progress >= 1) {
          ctx.beginPath();
          ctx.arc(x, y, 6 + pulse * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(99,102,241,${0.15 - pulse * 0.1})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = scores[i] > 0.8 ? '#3fb950' : scores[i] > 0.3 ? '#d29922' : '#6366f1';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Labels
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const labelR = r + 24;
        const x = cx + labelR * Math.cos(angle);
        const y = cy + labelR * Math.sin(angle);
        const score = scores[i];
        const color = score > 0.8 ? '#3fb950' : score > 0.3 ? '#d29922' : '#8b949e';

        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(SKILLS[i].label, x, y);
      }

      if (progress >= 1) cancelAnimationFrame(animRef.current);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [knownTopicIds.join(','), partialTopicIds.join(',')]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      style={{ width: '100%', maxWidth: 300, height: 'auto' }}
    />
  );
}
