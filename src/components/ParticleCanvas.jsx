import { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = e => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMouseMove);

    // DevOps icons as text particles
    const symbols = ['λ', '∞', '⚡', '☁', '⬡', '◈', '⬢', '⟳', '≋', '⌬', '◎', '⊕'];

    // Create particles
    const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 18000));
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 12 + 6,
      opacity: Math.random() * 0.3 + 0.05,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      hue: Math.random() * 60 + 220, // blue-purple range
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    let frame = 0;

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      particles.forEach((p, i) => {
        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.vx += (dx / dist) * 0.3;
          p.vy += (dy / dist) * 0.3;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Wrap around
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        // Pulse opacity
        const pulse = (Math.sin(frame * 0.02 + p.pulseOffset) + 1) / 2;
        const alpha = p.opacity * (0.5 + pulse * 0.5);

        // Draw connections between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const cx = p.x - q.x, cy = p.y - q.y;
          const d = Math.sqrt(cx * cx + cy * cy);
          if (d < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `hsla(${p.hue}, 70%, 60%, ${(1 - d / 140) * 0.12})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw symbol
        ctx.font = `${p.size}px JetBrains Mono, monospace`;
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${alpha})`;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, ${alpha * 0.8})`;
        ctx.shadowBlur = 8;
        ctx.fillText(p.symbol, p.x, p.y);
        ctx.shadowBlur = 0;
      });
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.7,
      }}
    />
  );
}
