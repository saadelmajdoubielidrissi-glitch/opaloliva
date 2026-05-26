import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useI18n } from '../../i18n/I18nContext';

export default function HowToOrder() {
  const { t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="how" className="section section-dark" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <span className="eyebrow">{t.how.eyebrow}</span>
          <h2 className="section-title section-title-light">{t.how.title}</h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '32px',
          position: 'relative',
        }}>
          {/* Connecting line (desktop) */}
          <div style={{
            position: 'absolute',
            top: '48px',
            left: '16.6%',
            right: '16.6%',
            height: '2px',
            background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)',
            opacity: 0.3,
          }} />

          {t.how.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{
                textAlign: 'center',
                padding: '32px 24px',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255,255,255,0.08)',
                position: 'relative',
              }}
            >
              {/* Step number */}
              <div style={{
                position: 'absolute',
                top: '-16px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--color-accent)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {i + 1}
              </div>
              <div style={{ fontSize: '3rem', marginBottom: '20px', marginTop: '8px' }}>{step.icon}</div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                color: 'var(--color-cream)',
                marginBottom: '12px',
              }}>
                {step.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontSize: '0.93rem' }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

