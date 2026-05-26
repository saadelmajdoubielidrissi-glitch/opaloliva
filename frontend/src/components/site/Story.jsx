import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useI18n } from '../../i18n/I18nContext';
import { IMAGES } from '../../lib/site';

export default function Story() {
  const { t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="story" className="section" ref={ref}
      style={{ background: 'var(--color-bg)', overflow: 'hidden' }}
    >
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '80px',
          alignItems: 'center',
        }}>
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="eyebrow">{t.story.eyebrow}</span>
            <h2 className="section-title">{t.story.title}</h2>
            <div className="olive-divider"><span style={{ fontSize: '1.2rem' }}>🫒</span></div>
            <p style={{ color: 'var(--color-muted)', lineHeight: 1.8, marginBottom: '20px', fontSize: '1.05rem' }}>
              {t.story.body}
            </p>
            <p style={{ color: 'var(--color-muted)', lineHeight: 1.8, fontSize: '1.05rem' }}>
              {t.story.body2}
            </p>

            {/* Pull quote */}
            <blockquote style={{
              marginTop: '32px',
              padding: '24px 28px',
              borderLeft: '3px solid var(--color-accent)',
              background: 'var(--color-bg-alt)',
              borderRadius: '0 var(--radius) var(--radius) 0',
            }}>
              <p style={{
                fontFamily: 'var(--font-accent)',
                fontSize: '1.15rem',
                fontStyle: 'italic',
                color: 'var(--color-primary-dark)',
                lineHeight: 1.6,
              }}>
                {t.story.quote}
              </p>
            </blockquote>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ position: 'relative' }}
          >
            <div style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
              aspectRatio: '4/5',
            }}>
              <img
                src={IMAGES.story}
                alt="Olive tree branches with green olives"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {/* Decorative badge */}
            <div style={{
              position: 'absolute',
              bottom: '-20px',
              left: '-20px',
              background: 'var(--color-accent)',
              color: '#fff',
              borderRadius: 'var(--radius)',
              padding: '16px 20px',
              boxShadow: 'var(--shadow-lg)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.8rem', lineHeight: 1 }}>❄️</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '4px' }}>–12 °C</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9, marginTop: '2px' }}>télállóság</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

