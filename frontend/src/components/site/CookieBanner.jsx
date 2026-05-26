import { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';

export default function CookieBanner() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(() => {
    try { return !localStorage.getItem('opaloliva_cookie'); }
    catch { return true; }
  });

  if (!visible) return null;

  const accept = () => {
    try { localStorage.setItem('opaloliva_cookie', 'accepted'); } catch {}
    setVisible(false);
  };
  const decline = () => {
    try { localStorage.setItem('opaloliva_cookie', 'declined'); } catch {}
    setVisible(false);
  };

  return (
    <div
      data-testid="cookie-banner"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 80,
        background: 'rgba(26, 34, 20, 0.97)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
      }}
    >
      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', flex: 1, minWidth: '200px' }}>
        🍪 {t.cookie.text}
      </p>
      <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
        <button
          data-testid="cookie-accept"
          onClick={accept}
          className="btn btn-primary"
          style={{ padding: '8px 20px', fontSize: '0.85rem' }}
        >
          {t.cookie.accept}
        </button>
        <button
          onClick={decline}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'rgba(255,255,255,0.7)',
            padding: '8px 16px',
            borderRadius: '100px',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          {t.cookie.decline}
        </button>
      </div>
    </div>
  );
}

