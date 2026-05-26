import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useI18n } from '../i18n/I18nContext';

const API = import.meta.env.VITE_BACKEND_URL || '';

export default function PaymentSuccess() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const [status, setStatus] = useState('pending'); // pending | completed | failed
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!sessionId) { setStatus('failed'); return; }

    const poll = async () => {
      try {
        const res = await axios.get(`${API}/api/checkout/status/${sessionId}`);
        const payStatus = res.data.payment_status;
        if (payStatus === 'completed') { setStatus('completed'); return; }
        if (attempts >= 12) { setStatus(payStatus === 'pending' ? 'pending' : 'failed'); return; }
      } catch {
        if (attempts >= 12) { setStatus('failed'); return; }
      }
      setAttempts(a => a + 1);
    };

    const timer = setInterval(poll, 2000);
    poll();
    return () => clearInterval(timer);
  }, [sessionId, attempts]);

  const isCompleted = status === 'completed';
  const isPending = status === 'pending' && attempts < 12;
  const isFailed = !isCompleted && !isPending;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
      padding: '40px 20px',
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        padding: '48px 40px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
          {isCompleted ? '✅' : isPending ? '⏳' : '❌'}
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.8rem',
          color: 'var(--color-dark)',
          marginBottom: '16px',
        }}>
          {isCompleted ? t.payment.successTitle : isPending ? t.payment.pendingTitle : t.payment.failedTitle}
        </h1>

        <p style={{ color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: '32px' }}>
          {isCompleted ? t.payment.successSub : isPending ? t.payment.pendingSub : t.payment.failedSub}
        </p>

        {isPending && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              border: '3px solid var(--color-bg-alt)',
              borderTop: '3px solid var(--color-accent)',
              animation: 'spin 1s linear infinite',
              margin: '0 auto',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link to="/" className="btn btn-primary" style={{ justifyContent: 'center', padding: '14px' }}>
            {t.payment.backHome}
          </Link>
          {isFailed && (
            <Link to="/#contact" className="btn btn-outline-dark" style={{ justifyContent: 'center', padding: '14px' }}>
              {t.payment.contactUs}
            </Link>
          )}
        </div>

        {sessionId && (
          <p style={{ marginTop: '24px', fontSize: '0.72rem', color: 'var(--color-muted)', fontFamily: 'monospace' }}>
            ID: {sessionId.slice(0, 20)}...
          </p>
        )}
      </div>
    </div>
  );
}
