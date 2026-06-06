/**
 * AntigravityField — canvas-based particle system that repels from cursor.
 * Each particle has mass, velocity, friction, and spring return force.
 * Particles also connect to neighbors with tension lines.
 * Inspired by Active Theory's LIDAR particle systems.
 */
import { useEffect, useRef } from 'react';

const COLORS = ['#c8ff00', '#a970ff', '#ff4500', '#00d4ff'];

export default function AntigravityField({ count = 220, repelDist = 160, repelForce = 0.7, returnForce = 0.022, friction = 0.86, style = {} }) {
  const ref     = useRef(null);
  const secRef  = useRef(null);

  useEffect(() => {
    const cv  = ref.current;
    const ctx = cv.getContext('2d');
    let pts, raf, W, H;
    let lx = -999, ly = -999; // local cursor in section space

    const init = () => {
      const sec = cv.parentElement;
      W = cv.width  = sec.offsetWidth;
      H = cv.height = sec.offsetHeight;
      pts = Array.from({ length: count }, () => {
        const x = Math.random() * W, y = Math.random() * H;
        return { x, y, ox: x, oy: y, vx: 0, vy: 0, r: 1.2 + Math.random() * 2, col: COLORS[0 | Math.random() * 4], mass: 0.4 + Math.random() * 0.7 };
      });
    };
    init();

    const onResize = () => init();
    window.addEventListener('resize', onResize);

    const onMove = e => {
      const sec = cv.parentElement;
      const r   = sec.getBoundingClientRect();
      lx = e.clientX - r.left;
      ly = e.clientY - r.top;
    };
    window.addEventListener('mousemove', onMove);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      pts.forEach((p, i) => {
        const dx = lx - p.x, dy = ly - p.y;
        const d  = Math.sqrt(dx * dx + dy * dy);

        /* Antigravity repulsion */
        if (d < repelDist && d > 0.5) {
          const f = ((repelDist - d) / repelDist) * repelForce;
          p.vx -= (dx / d) * f / p.mass;
          p.vy -= (dy / d) * f / p.mass;
        }

        /* Spring return to origin */
        p.vx += (p.ox - p.x) * returnForce;
        p.vy += (p.oy - p.y) * returnForce;
        p.vx *= friction; p.vy *= friction;
        p.x  += p.vx;     p.y  += p.vy;

        /* Neighbor connections */
        for (let j = i + 1; j < pts.length; j++) {
          const q  = pts[j];
          const dd = Math.hypot(p.x - q.x, p.y - q.y);
          if (dd < 90) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(200,255,0,${(1 - dd / 90) * 0.07})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }

        /* Draw particle */
        const glow = d < repelDist ? (1 - d / repelDist) : 0;
        if (glow > 0) { ctx.shadowColor = p.col; ctx.shadowBlur = glow * 20; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + glow * p.r * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = p.col + (glow > 0.08 ? 'ff' : '4a');
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
    };
  }, [count, repelDist, repelForce, returnForce, friction]);

  return (
    <canvas
      ref={ref}
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
        ...style,
      }}
    />
  );
}
