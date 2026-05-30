import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useI18n } from '../../i18n/I18nContext';
import { IMAGES } from '../../lib/site';

export default function About() {
  const { t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" className="section" ref={ref}
      style={{ background: 'var(--color-bg-alt)' }}
    >
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '80px',
          alignItems: 'center',
        }}>
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            style={{ position: 'relative' }}
          >
            <div style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
              aspectRatio: '3/4',
            }}>
              <img
                src="/images/peter.jpg"
                alt="Lovei Péter"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {/* Location chip */}
            <div style={{
              position: 'absolute',
              bottom: '-16px',
              right: '-16px',
              background: '#fff',
              borderRadius: 'var(--radius)',
              padding: '12px 20px',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '1.4rem' }}>📍</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-dark)' }}>Lovei Péter</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>{t.about.location}</div>
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="eyebrow">{t.about.eyebrow}</span>
            <h2 className="section-title">{t.about.title}</h2>
            <div className="olive-divider"><span style={{ fontSize: '1.2rem' }}>🫒</span></div>
            <p style={{ color: 'var(--color-muted)', lineHeight: 1.8, marginBottom: '20px', fontSize: '1.05rem' }}>
              {t.about.body}
            </p>
            <p style={{ color: 'var(--color-muted)', lineHeight: 1.8, marginBottom: '32px', fontSize: '1.05rem' }}>
              {t.about.body2}
            </p>
            {/* Signature */}
            <div style={{
              padding: '20px 24px',
              background: 'var(--color-dark)',
              borderRadius: 'var(--radius)',
              display: 'inline-block',
            }}>
              <div style={{
                fontFamily: 'var(--font-hand)',
                fontSize: '1.8rem',
                color: 'var(--color-cream)',
                letterSpacing: '0.02em',
              }}>
                {t.about.signature}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {t.about.location}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

