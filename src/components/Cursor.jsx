import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dot  = useRef(null);
  const ring = useRef(null);
  const pos  = useRef({ x: -200, y: -200 });
  const lag  = useRef({ x: -200, y: -200 });
  const vel  = useRef({ x: 0, y: 0 });
  const prev = useRef({ x: -200, y: -200 });
  const raf  = useRef(null);
  const trails = useRef([]);

  useEffect(() => {
    // Build 12 velocity-colored trail dots
    const els = Array.from({ length: 12 }, (_, i) => {
      const d = document.createElement('div');
      d.className = 'c-trail';
      const r = i / 12;
      const sz = 5 - r * 3.5;
      d.style.cssText = `width:${sz}px;height:${sz}px;z-index:${99990 - i};` +
        `background:rgba(0,${Math.floor(255 - r * 80)},${Math.floor(209 - r * 120)},${0.6 - r * 0.5})`;
      document.body.appendChild(d);
      return { el: d, x: -200, y: -200 };
    });
    trails.current = els;

    const onMove = e => {
      vel.current.x = e.clientX - prev.current.x;
      vel.current.y = e.clientY - prev.current.y;
      prev.current  = { x: e.clientX, y: e.clientY };
      pos.current   = { x: e.clientX, y: e.clientY };
    };

    const onOver = e => {
      const t = e.target;
      const isLink = t.tagName === 'A' || t.tagName === 'BUTTON' || t.closest('a,button,[data-cursor="link"]');
      const isHot  = t.closest('[data-cursor="hot"]') || t.closest('.h-card') || t.closest('.topic-row') || t.closest('.mag-btn');
      if (!ring.current) return;
      ring.current.className = isLink ? 'link' : isHot ? 'hot' : '';
      ring.current.id = 'c-ring';
      ring.current.className = (isLink ? 'link ' : isHot ? 'hot ' : '') + '';
      // re-apply id after className wipe
      ring.current.setAttribute('id', 'c-ring');
      if (isLink)     ring.current.classList.add('link');
      else if (isHot) ring.current.classList.add('hot');
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);

    const loop = () => {
      raf.current = requestAnimationFrame(loop);
      if (dot.current) {
        dot.current.style.transform = `translate(${pos.current.x - 4}px,${pos.current.y - 4}px)`;
      }
      lag.current.x += (pos.current.x - lag.current.x) * 0.1;
      lag.current.y += (pos.current.y - lag.current.y) * 0.1;
      if (ring.current) {
        ring.current.style.transform = `translate(${lag.current.x - 19}px,${lag.current.y - 19}px)`;
      }
      let px = pos.current.x, py = pos.current.y;
      trails.current.forEach((t, i) => {
        const e = 0.26 - i * 0.015;
        t.x += (px - t.x) * e;
        t.y += (py - t.y) * e;
        t.el.style.transform = `translate(${t.x - 2.5}px,${t.y - 2.5}px)`;
        t.el.style.opacity = String(0.7 - i / 12);
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
      <div id="c-dot"  ref={dot}  />
      <div id="c-ring" ref={ring} />
    </>
  );
}
