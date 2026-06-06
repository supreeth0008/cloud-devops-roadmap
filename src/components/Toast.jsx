import { useState, useCallback, useEffect } from 'react';

let _push = null;
export const toast = {
  success: msg => _push && _push(msg, 'success'),
  info:    msg => _push && _push(msg, 'info'),
  warn:    msg => _push && _push(msg, 'warn'),
  error:   msg => _push && _push(msg, 'error'),
};

export function ToastProvider() {
  const [items, setItems] = useState([]);

  _push = useCallback((msg, type = 'info') => {
    const id = Date.now() + Math.random();
    setItems(p => [...p, { id, msg, type }]);
    setTimeout(() => setItems(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const BORDER = { success: 'rgba(200,255,0,0.35)', info: 'rgba(0,212,255,0.35)', warn: 'rgba(255,165,0,0.35)', error: 'rgba(255,69,0,0.4)' };
  const LEFT   = { success: 'var(--acid)', info: 'var(--ice)', warn: '#ffa500', error: 'var(--ember)' };

  return (
    <div style={{ position:'fixed', bottom:28, right:28, zIndex:9500, display:'flex', flexDirection:'column', gap:8, pointerEvents:'none' }}>
      {items.map(t => (
        <div key={t.id} className="toast" style={{ borderColor: BORDER[t.type], borderLeft:`3px solid ${LEFT[t.type]}` }}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
