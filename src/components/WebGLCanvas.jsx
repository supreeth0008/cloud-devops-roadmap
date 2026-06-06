import { useEffect, useRef } from 'react';

export default function WebGLCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    let W, H, t = 0, raf;
    const mouse = { x: 0.5, y: 0.5 };

    const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX / W; mouse.y = e.clientY / H; });

    // Stars — teal/coral/cream palette
    const COLS = ['#00FFD1', '#FF6B4A', '#F0EDE8', '#00ccaa', '#ff9080'];
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random(), y: Math.random(), z: Math.random(),
      vz: 0.0007 + Math.random() * 0.002,
      col: COLS[0 | Math.random() * COLS.length], sz: 1 + Math.random() * 2.2,
    }));

    // Floating devops commands — teal text
    const cmds = [
      'kubectl apply -f deploy.yml',   'terraform plan -out=plan',
      'docker build --no-cache -t app', 'helm upgrade --install api ./chart',
      'aws eks update-kubeconfig',      'prometheus --config.file=prom.yml',
      'git push origin main',           'argocd app sync production',
      'ansible-playbook deploy.yml',    'trivy image app:latest',
    ].map(t => ({ t, x: Math.random(), y: Math.random(), op: 0.03 + Math.random() * 0.05, sp: 0.00005 + Math.random() * 0.00008, sz: 10 + Math.random() * 4 }));

    const draw = () => {
      raf = requestAnimationFrame(draw); t += 0.003;
      ctx.fillStyle = 'rgba(11,11,11,0.19)'; ctx.fillRect(0, 0, W, H);

      // Mouse-reactive perspective grid — teal lines
      const vx = W * (0.25 + mouse.x * 0.5), vy = H * (0.22 + mouse.y * 0.38);
      for (let i = 0; i <= 22; i++) {
        const u = i / 22, ey = H * 0.82, ly = ey + (u - 0.5) * H * 0.34;
        const a = 0.015 + u * 0.032;
        ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(0, ly);
        ctx.strokeStyle = `rgba(0,255,209,${a * 0.5})`; ctx.lineWidth = 0.5; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(W, ly);
        ctx.strokeStyle = `rgba(0,255,209,${a * 0.5})`; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(u * W, ey + (u - 0.5) * H * 0.1);
        ctx.strokeStyle = `rgba(255,107,74,${0.01 + u * 0.015})`; ctx.lineWidth = 0.35; ctx.stroke();
      }

      // Floating commands
      cmds.forEach(l => {
        l.y -= l.sp; if (l.y < -0.07) { l.y = 1.07; l.x = Math.random(); }
        ctx.font = `${l.sz}px 'DM Mono',monospace`;
        ctx.fillStyle = `rgba(0,255,209,${l.op})`; ctx.fillText(l.t, l.x * W, l.y * H);
      });

      // Star-field zoom
      stars.forEach(p => {
        p.z += p.vz; if (p.z > 1) { p.z = 0; p.x = Math.random(); p.y = Math.random(); }
        const px = (p.x - 0.5) / (1 - p.z) + 0.5, py = (p.y - 0.5) / (1 - p.z) + 0.5;
        if (px < 0 || px > 1 || py < 0 || py > 1) return;
        const r = Math.max(0.4, p.sz * p.z * 2.2);
        ctx.beginPath(); ctx.arc(px * W, py * H, r, 0, Math.PI * 2);
        ctx.fillStyle = p.col + Math.floor(p.z * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      // Breathing orb — teal/coral mix
      const ox = W * 0.5 + Math.sin(t * 0.42) * W * 0.06, oy = H * 0.44 + Math.cos(t * 0.28) * H * 0.05;
      const rr = Math.min(W, H) * (0.26 + Math.sin(t * 0.7) * 0.02);
      const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, rr);
      g.addColorStop(0,   'rgba(0,255,209,0.07)');
      g.addColorStop(0.5, 'rgba(255,107,74,0.04)');
      g.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      // Scanline
      const sy = (t * 150) % H;
      const sg = ctx.createLinearGradient(0, sy - 80, 0, sy + 2);
      sg.addColorStop(0, 'rgba(0,255,209,0)'); sg.addColorStop(1, 'rgba(0,255,209,0.025)');
      ctx.fillStyle = sg; ctx.fillRect(0, sy - 80, W, 82);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />;
}
