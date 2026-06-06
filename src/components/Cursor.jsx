import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dot   = useRef(null);
  const ring  = useRef(null);
  const pos   = useRef({ x: -200, y: -200 });
  const ringl = useRef({ x: -200, y: -200 });
  const raf   = useRef(null);
  const trails = useRef([]);

  useEffect(() => {
    // Build 10 trail elements
    const els = Array.from({ length: 10 }, (_, i) => {
      const d = document.createElement('div');
      d.className = 'cursor-trail';
      const r = i / 10;
      const sz = 5 - r * 3.5;
      d.style.cssText = `width:${sz}px;height:${sz}px;background:rgba(200,255,0,${0.55 - r * 0.5});z-index:${99990 - i}`;
      document.body.appendChild(d);
      return { el: d, x: -200, y: -200 };
    });
    trails.current = els;

    const onMove = e => { pos.current = { x: e.clientX, y: e.clientY }; };

    const onOver = e => {
      const t = e.target;
      const isHot = t.tagName === 'BUTTON' || t.tagName === 'A' ||
        t.closest('.mag-btn') || t.closest('.phase-tile') ||
        t.closest('[data-cursor="hot"]') || t.closest('.pill-nav');
      const isText = t.closest('[data-cursor="text"]');
      if (ring.current) {
        ring.current.className = isText ? 'hot text' : isHot ? 'hot' : '';
        ring.current.id = 'cursor-ring';
        ring.current.className = 'cursor-ring' + (isText ? ' text' : isHot ? ' hot' : '');
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);

    const loop = () => {
      raf.current = requestAnimationFrame(loop);
      if (dot.current) {
        dot.current.style.transform = `translate(${pos.current.x - 4}px,${pos.current.y - 4}px)`;
      }
      // Ease ring
      ringl.current.x += (pos.current.x - ringl.current.x) * 0.095;
      ringl.current.y += (pos.current.y - ringl.current.y) * 0.095;
      if (ring.current) {
        ring.current.style.transform = `translate(${ringl.current.x - 18}px,${ringl.current.y - 18}px)`;
      }
      // Chain trail
      let px = pos.current.x, py = pos.current.y;
      trails.current.forEach((t, i) => {
        const ease = 0.24 - i * 0.015;
        t.x += (px - t.x) * ease;
        t.y += (py - t.y) * ease;
        t.el.style.transform = `translate(${t.x - 2.5}px,${t.y - 2.5}px)`;
        t.el.style.opacity = String(0.7 - i / 10);
        px = t.x; py = t.y;
      });
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      trails.current.forEach(t => t.el.remove());
    };
  }, []);

  return (
    <>
      <div id="cursor-dot"  ref={dot}  />
      <div id="cursor-ring" ref={ring} />
    </>
  );
}
