import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import axios from 'axios';
import { useI18n } from '../../i18n/I18nContext';
import { SITE } from '../../lib/site';

const API = import.meta.env.VITE_BACKEND_URL || '';

export default function Contact() {
  const { lang, t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await axios.post(`${API}/api/contact`, { ...form, language: lang });
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section" ref={ref}
      style={{ background: 'var(--color-bg-alt)' }}
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <span className="eyebrow">{t.contact.eyebrow}</span>
          <h2 className="section-title">{t.contact.title}</h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '60px',
          alignItems: 'start',
        }}>
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {/* Phone */}
            <a
              data-testid="contact-phone"
              href={SITE.phoneLink}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                background: '#fff',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '12px',
                textDecoration: 'none',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(74,92,58,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                📞
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-dark)', fontSize: '1rem' }}>{SITE.phonePretty}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{t.contact.phoneSub}</div>
              </div>
            </a>

            {/* Email */}
            <a
              data-testid="contact-email"
              href={SITE.emailLink}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                background: '#fff',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '12px',
                textDecoration: 'none',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(74,92,58,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                📧
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-dark)', fontSize: '0.95rem' }}>{SITE.email}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{t.contact.emailBtn}</div>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              data-testid="contact-whatsapp"
              href={SITE.whatsappPrefilled}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-green"
              style={{ width: '100%', justifyContent: 'center', marginBottom: '24px' }}
            >
              💬 {t.contact.whatsappBtn}
            </a>

            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
              {t.contact.responseTime}
            </p>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div style={{
              background: '#fff',
              borderRadius: 'var(--radius-lg)',
              padding: '36px',
              boxShadow: 'var(--shadow-md)',
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '24px', color: 'var(--color-dark)' }}>
                {t.contact.formTitle}
              </h3>

              {status === 'success' ? (
                <div style={{
                  padding: '24px',
                  background: 'rgba(74,92,58,0.08)',
                  borderRadius: 'var(--radius)',
                  textAlign: 'center',
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}>
                  ✅ {t.contact.successMsg}
                </div>
              ) : (
                <form
                  data-testid="contact-form"
                  onSubmit={handleSubmit}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  <div className="form-group">
                    <label className="form-label">{t.contact.nameLabel} *</label>
                    <input className="form-input" type="text" placeholder={t.contact.namePlaceholder}
                      value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.contact.emailLabel} *</label>
                    <input className="form-input" type="email" placeholder={t.contact.emailPlaceholder}
                      value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.contact.phoneLabel}</label>
                    <input className="form-input" type="tel" placeholder={t.contact.phonePlaceholder}
                      value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.contact.msgLabel} *</label>
                    <textarea className="form-input" placeholder={t.contact.msgPlaceholder}
                      value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
                  </div>

                  {status === 'error' && (
                    <div style={{ color: '#c0392b', fontSize: '0.9rem', fontWeight: 600 }}>
                      ❌ {t.contact.errorMsg}
                    </div>
                  )}

                  <button
                    data-testid="contact-submit"
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '16px', opacity: status === 'loading' ? 0.7 : 1 }}
                  >
                    {status === 'loading' ? '⏳ Küldés...' : t.contact.submitBtn}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

