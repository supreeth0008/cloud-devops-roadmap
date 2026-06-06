import { useState, useCallback } from 'react';

let _push = null;
export const toast = {
  success: m => _push?.(m, 'success'),
  info:    m => _push?.(m, 'info'),
  warn:    m => _push?.(m, 'warn'),
  error:   m => _push?.(m, 'error'),
};

export function ToastProvider() {
  const [items, setItems] = useState([]);
  _push = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setItems(p => [...p.slice(-3), { id, msg, type }]);
    setTimeout(() => setItems(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9500, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
      {items.map(t => <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>)}
    </div>
  );
}
