import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE } from '../../lib/site';

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* WhatsApp button */}
      <a
        data-testid="floating-whatsapp"
        href={SITE.whatsappPrefilled}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#25D366',
          color: '#fff',
          padding: '14px 20px',
          borderRadius: '100px',
          boxShadow: '0 4px 24px rgba(37, 211, 102, 0.4)',
          fontWeight: 700,
          fontSize: '0.9rem',
          textDecoration: 'none',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(37, 211, 102, 0.5)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 4px 24px rgba(37, 211, 102, 0.4)';
        }}
      >
        <span style={{ fontSize: '1.3rem' }}>💬</span>
        <span className="hidden-mobile">WhatsApp</span>

        {/* Pulse ring */}
        <style>{`
          @keyframes pulse-ring {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(1.5); opacity: 0; }
          }
          .whatsapp-pulse::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 100px;
            background: #25D366;
            animation: pulse-ring 2s ease-out infinite;
            z-index: -1;
          }
        `}</style>
      </a>

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            data-testid="back-to-top"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              position: 'fixed',
              bottom: '28px',
              left: '28px',
              zIndex: 60,
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.background = 'var(--color-primary-dark)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = 'var(--color-primary)'; }}
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

