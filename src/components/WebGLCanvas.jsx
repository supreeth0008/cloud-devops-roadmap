/**
 * WebGLCanvas — Full-viewport canvas background
 * Active Theory style: pitch-black base, particle field that reacts
 * to cursor, perspective grid lines that shift with mouse,
 * floating devops text, breathing orb, scanline sweep.
 * Pure Canvas2D — no Three.js dependency, loads instantly.
 */
import { useEffect, useRef } from 'react';

export default function WebGLCanvas({ style = {} }) {
  const ref = useRef(null);

  useEffect(() => {
    const cv  = ref.current;
    const ctx = cv.getContext('2d');
    let W, H, t = 0, raf;
    const mouse = { x: 0.5, y: 0.5 };

    /* ── Resize ── */
    const resize = () => {
      W = cv.width  = window.innerWidth;
      H = cv.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
    });

    /* ── Particles (star-field zoom) ── */
    const COLS = ['#c8ff00', '#a970ff', '#ff4500', '#00d4ff', '#ffffff'];
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random(), y: Math.random(), z: Math.random(),
      vz: 0.0006 + Math.random() * 0.002,
      col: COLS[0 | Math.random() * COLS.length],
      sz: 1 + Math.random() * 2.2,
    }));

    /* ── Floating DevOps commands ── */
    const cmds = [
      'kubectl apply -f deploy.yml',
      'terraform plan -out=plan.tfplan',
      'docker build --no-cache -t app .',
      'helm upgrade --install api ./chart',
      'aws eks update-kubeconfig --name prod',
      'prometheus --config.file=/etc/prom.yml',
      'git push origin main --follow-tags',
      'argocd app sync production --prune',
      'ansible-playbook -i inventory site.yml',
      'trivy image app:latest --exit-code 1',
      'kubectl rollout status deploy/api',
      'aws s3 sync dist/ s3://cdn-bucket',
    ].map(t => ({
      t, x: Math.random(), y: Math.random(),
      op: 0.032 + Math.random() * 0.052,
      sp: 0.00005 + Math.random() * 0.00008,
      sz: 10 + Math.random() * 4,
    }));

    /* ── Draw loop ── */
    const draw = () => {
      raf = requestAnimationFrame(draw);
      t += 0.003;

      /* Fade with trail */
      ctx.fillStyle = 'rgba(8,8,8,0.22)';
      ctx.fillRect(0, 0, W, H);

      /* Perspective grid — tracks mouse */
      const vx = W * (0.25 + mouse.x * 0.50);
      const vy = H * (0.20 + mouse.y * 0.40);
      const ey = H * 0.80;

      for (let i = 0; i <= 24; i++) {
        const u = i / 24;
        const ly = ey + (u - 0.5) * H * 0.36;
        const a  = 0.018 + u * 0.035;

        ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(0, ly);
        ctx.strokeStyle = `rgba(200,255,0,${a * 0.55})`; ctx.lineWidth = 0.5; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(W, ly);
        ctx.strokeStyle = `rgba(200,255,0,${a * 0.55})`; ctx.stroke();

        // Vertical vanishing lines
        ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(u * W, ey + (u - 0.5) * H * 0.12);
        ctx.strokeStyle = `rgba(169,112,255,${0.01 + u * 0.018})`; ctx.lineWidth = 0.35; ctx.stroke();
      }

      /* Floating commands */
      ctx.textBaseline = 'top';
      cmds.forEach(l => {
        l.y -= l.sp;
        if (l.y < -0.07) { l.y = 1.07; l.x = Math.random(); }
        ctx.font = `${l.sz}px 'DM Mono', monospace`;
        ctx.fillStyle = `rgba(200,255,0,${l.op})`;
        ctx.fillText(l.t, l.x * W, l.y * H);
      });

      /* Star-field zoom */
      stars.forEach(p => {
        p.z += p.vz;
        if (p.z > 1) { p.z = 0; p.x = Math.random(); p.y = Math.random(); }
        const px = (p.x - 0.5) / (1 - p.z) + 0.5;
        const py = (p.y - 0.5) / (1 - p.z) + 0.5;
        if (px < 0 || px > 1 || py < 0 || py > 1) return;
        const r = Math.max(0.4, p.sz * p.z * 2.2);
        ctx.beginPath(); ctx.arc(px * W, py * H, r, 0, Math.PI * 2);
        ctx.fillStyle = p.col + Math.floor(p.z * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      /* Central breathing orb */
      const ox = W * 0.5 + Math.sin(t * 0.42) * W * 0.06;
      const oy = H * 0.44 + Math.cos(t * 0.28) * H * 0.05;
      const rr = Math.min(W, H) * (0.26 + Math.sin(t * 0.7) * 0.02);
      const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, rr);
      g.addColorStop(0,   'rgba(200,255,0,0.07)');
      g.addColorStop(0.45,'rgba(169,112,255,0.04)');
      g.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      /* Scanline sweep */
      const sy = ((t * 140) % (H + 80)) - 80;
      const sg = ctx.createLinearGradient(0, sy, 0, sy + 80);
      sg.addColorStop(0, 'rgba(200,255,0,0)');
      sg.addColorStop(1, 'rgba(200,255,0,0.025)');
      ctx.fillStyle = sg; ctx.fillRect(0, sy, W, 80);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: 'fixed', inset: 0, width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none',
        ...style,
      }}
    />
  );
}
