import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useI18n } from '../../i18n/I18nContext';

function StatCounter({ value, suffix, label, inView }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = value / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
        fontWeight: 700,
        color: 'var(--color-accent)',
        lineHeight: 1,
      }}>
        {count}{suffix}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '8px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  );
}

export default function Trust() {
  const { t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' });

  return (
    <section id="why" className="section" ref={ref}
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <span className="eyebrow">{t.trust.eyebrow}</span>
          <h2 className="section-title">{t.trust.title}</h2>
        </motion.div>

        {/* Features grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '80px',
        }}>
          {t.trust.features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{
                padding: '32px 24px',
                background: '#fff',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                borderTop: '3px solid var(--color-accent)',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(26,34,20,0.15)' }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{feat.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '12px', color: 'var(--color-dark)' }}>
                {feat.title}
              </h3>
              <p style={{ color: 'var(--color-muted)', lineHeight: 1.7, fontSize: '0.93rem' }}>{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats banner */}
        <div
          ref={statsRef}
          style={{
            background: 'var(--color-dark)',
            borderRadius: 'var(--radius-lg)',
            padding: '48px 40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '40px',
            marginBottom: '80px',
          }}
        >
          {t.trust.stats.map((stat, i) => (
            <StatCounter
              key={i}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              inView={statsInView}
            />
          ))}
        </div>

        {/* Testimonials */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {t.trust.testimonials.map((test, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
              style={{
                padding: '28px',
                background: '#fff',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: '3rem', color: 'var(--color-accent)', opacity: 0.2, position: 'absolute', top: '12px', left: '20px', fontFamily: 'serif', lineHeight: 1 }}>"</div>
              <div className="stars" style={{ marginBottom: '12px' }}>{'★'.repeat(test.rating)}</div>
              <p style={{
                fontFamily: 'var(--font-accent)',
                fontSize: '1.05rem',
                fontStyle: 'italic',
                lineHeight: 1.7,
                color: 'var(--color-text)',
                marginBottom: '20px',
                position: 'relative',
                zIndex: 1,
              }}>
                "{test.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: '1rem',
                }}>
                  {test.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-dark)' }}>{test.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{test.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

